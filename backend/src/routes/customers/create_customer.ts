import express, { Request, Response } from "express";
import Customer from "../../models/customer";
import { authenticateToken } from "../security/authenticate";
import ErrorType from "../../types/error";
const router = express.Router();

// Handle the POST request to add a customer
router.post(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    const {
      personal_information: { first_name, last_name, email, company, currency },
      billing_details = {},
      shipping_details = {},
      contact_information = {},
    } = req.body;

    // Parse currency name and symbol
    const [currency_name, currency_symbol] = currency
      .split(" ")
      .map((part: string, index: number) =>
        index === 1 ? part.replace(/[()]/g, "") : part
      );

    // Create a new customer instance
    const newCustomer = new Customer({
      personal_information: {
        first_name,
        last_name,
        email,
        company,
        currency_name,
        currency_symbol,
      },
      billing_details,
      shipping_details,
      contact_information,
    });

    try {
      const savedCustomer = await newCustomer.save();
      res.status(201).json(savedCustomer);
    } catch (error) {
      logger.error(error);
      const err = error as ErrorType;
      if (
        err.code === 11000 &&
        err.keyPattern?.["personal_information.email"]
      ) {
        res.status(400).json({ message: "Same email cannot be used twice" });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
);

export default router;
