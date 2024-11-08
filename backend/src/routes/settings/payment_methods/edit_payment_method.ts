import express, { Request, Response } from "express";
import PaymentMethod from "../../../models/payment_method";
import { authenticateToken } from "../../security/authenticate";

const router = express.Router();

// Handle the update request
router.put(
  "/:id",
  authenticateToken,
  async function (req: Request, res: Response): Promise<void> {
    try {
      const payment_method_id = req.params.id;
      const { payment_method_name, payment_method_description } = req.body;

      // Find the old payment method
      const old_payment_method = await PaymentMethod.findById(
        payment_method_id
      );

      if (!old_payment_method) {
        res.status(404).send("Payment method not found");
        return;
      }

      // Update the payment method in the database
      const result = await PaymentMethod.findByIdAndUpdate(
        payment_method_id,
        {
          $set: {
            name: payment_method_name,
            description: payment_method_description,
          },
        },
        { new: true, runValidators: true }
      );

      if (!result) {
        res.status(404).send("Payment method not found");
        return;
      }

      res.status(201).json(result);
      return;
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

export default router;
