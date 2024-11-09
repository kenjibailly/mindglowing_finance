import express, { Request, Response } from "express";
import Tax from "../../../models/tax";
import { authenticateToken } from "../../security/authenticate";
import ErrorType from "src/types/error";

const router = express.Router();

// Handle the update request
router.put(
  "/:id",
  authenticateToken,
  async function (req: Request, res: Response): Promise<void> {
    try {
      const tax_id = req.params.id;
      const { tax_name, tax_description, tax_percentage } = req.body;
      const tax_default = req.body.tax_default === "on";

      // Find the old tax
      const old_tax = await Tax.findById(tax_id);

      if (!old_tax) {
        res.status(404).send("Tax not found");
        return;
      }

      // Update the tax in the database
      const result = await Tax.findByIdAndUpdate(
        tax_id,
        {
          $set: {
            name: tax_name,
            percentage: tax_percentage,
            default: tax_default,
            description: tax_description,
          },
        },
        { new: true, runValidators: true }
      );

      if (!result) {
        res.status(404).send("Tax not found");
        return;
      }

      res.status(201).json(result);
      return;
    } catch (error) {
      logger.error(error);
      const err = error as ErrorType;
      if (err.code === 11000 && err.keyPattern && err.keyPattern["default"]) {
        // Duplicate name error
        res.status(400).json({
          message: "Another tax has already been set to the default",
        });
        return;
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  }
);

export default router;
