import express, { Request, Response } from "express";
import Customer from "../../models/customer";
import { authenticateToken } from "../security/authenticate";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    const customerId = req.params.id;
    try {
      // Fetch the customer by ID
      const customer = await Customer.findOne({ _id: customerId });

      // Handle customer not found
      if (!customer) {
        res.status(404).json({ message: "Customer not found" });
        return; // Explicitly return after sending the response
      }

      // Return the customer response
      res.json(customer.toObject()); // Send the response
      return; // Explicitly return
    } catch (error) {
      console.error(error);
      // Return an error message as the response
      res.status(500).json({ message: "Internal server error" });
      return; // Explicitly return
    }
  }
);

export default router;
