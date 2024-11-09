import express, { Request, Response } from "express";
import Discount from "../../../models/discount";
import { authenticateToken } from "../../security/authenticate";

const router = express.Router();

// Handle the update request
router.put(
  "/:id",
  authenticateToken,
  async function (req: Request, res: Response): Promise<void> {
    try {
      const discount_id = req.params.id;
      const {
        discount_name,
        discount_code,
        discount_amount_total = 0,
        discount_amount_percentage = 0,
        discount_description,
      } = req.body;

      // Find the old payment method
      const old_discount = await Discount.findById(discount_id);

      if (!old_discount) {
        res.status(404).send("Payment method not found");
        return;
      }

      // Update the payment method in the database
      const result = await Discount.findByIdAndUpdate(
        discount_id,
        {
          $set: {
            name: discount_name,
            code: discount_code,
            "amount.total": discount_amount_total,
            "amount.percentage": discount_amount_percentage,
            description: discount_description,
          },
        },
        { new: true, runValidators: true }
      );

      if (!result) {
        res.status(404).send("Discount not found");
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
