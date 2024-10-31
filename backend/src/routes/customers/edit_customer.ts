import express, { Request, Response, Router } from "express";
import Customer from "../../models/customer";
import { authenticateToken } from "../security/authenticate";

const router: Router = express.Router();

// Update customer data
router.put(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const customerId = req.params.id;
      const updatedCustomer = req.body;

      if (!updatedCustomer || !updatedCustomer.personal_information) {
        return res.status(400).json({ message: "Invalid customer data" });
      }

      // Extract currency information
      const { currency } = updatedCustomer.personal_information;
      const [currency_name, currency_symbol] = currency
        ? [currency.split(" ")[0], currency.split(" ")[1].replace(/[()]/g, "")]
        : ["", ""];

      // Add currency fields to the updatedCustomer object
      updatedCustomer.personal_information.currency_name = currency_name;
      updatedCustomer.personal_information.currency_symbol = currency_symbol;

      // Update the customer in the database
      const result = await Customer.findByIdAndUpdate(
        customerId,
        updatedCustomer,
        { new: true }
      );

      if (!result) {
        return res.status(404).json({ message: "Customer not found" });
      }

      return res.json({ success: true, customer: result });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
