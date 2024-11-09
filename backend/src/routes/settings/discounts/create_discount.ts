import express, { Request, Response } from "express";
import Discount from "../../../models/discount";
import { authenticateToken } from "../../security/authenticate";
import ErrorType from "../../../types/error";
import router from "./discounts";

// Handle the POST request to add a discount
router.post(
  "/",
  authenticateToken,
  async function (req: Request, res: Response) {
    // Extract form data from the request
    const {
      discount_name,
      discount_code,
      discount_description,
      discount_amount_total = 0,
      discount_amount_percentage = 0,
    } = req.body;

    // Create a new discount instance with the form details
    const newDiscount = new Discount({
      name: discount_name,
      code: discount_code,
      "amount.total": discount_amount_total,
      "amount.percentage": discount_amount_percentage,
      description: discount_description,
    });

    try {
      // Save the discount to the database
      const savedDiscount = await newDiscount.save();
      res.status(201).json(savedDiscount);
    } catch (error) {
      const err = error as ErrorType;
      logger.error(error);

      // Check if the error is a duplicate key violation
      if (err.code === 11000 && err.keyPattern && err.keyPattern["name"]) {
        // Duplicate name error
        res
          .status(400)
          .json({ message: "Discount with the same name already exists" });
      } else {
        // Other internal server error
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
);

export default router;
