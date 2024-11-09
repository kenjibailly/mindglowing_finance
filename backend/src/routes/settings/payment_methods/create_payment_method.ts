import express, { Request, Response } from "express";
import PaymentMethod from "../../../models/payment_method";
import { authenticateToken } from "../../security/authenticate";
import ErrorType from "../../../types/error";

const router = express.Router();

// Handle the POST request to add a payment method
router.post(
  "/",
  authenticateToken,
  async function (req: Request, res: Response) {
    // Extract form data from the request
    const { payment_method_name, payment_method_description } = req.body;

    // Create a new payment method instance with the form details
    const newPaymentMethod = new PaymentMethod({
      name: payment_method_name,
      description: payment_method_description,
    });

    try {
      // Save the payment method to the database
      const savedPaymentMethod = await newPaymentMethod.save();
      if (!savedPaymentMethod) {
        res.status(400).send("Could not add new payment method");
        return;
      }
      res.status(200).json(savedPaymentMethod);
      return;
    } catch (error) {
      logger.error(error);

      const err = error as ErrorType;

      // Check if the error is a duplicate key violation
      if (err.code === 11000 && err.keyPattern && err.keyPattern["name"]) {
        // Duplicate name error
        res.status(400).json({
          message: "Payment Method with the same name already exists",
        });
        return;
      } else {
        // Other internal server error
        res.status(500).json({ message: "Internal Server Error" });
        return;
      }
    }
  }
);

export default router;
