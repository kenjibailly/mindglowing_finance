import express, { Request, Response } from "express";
import Discount from "../../../models/discount";
import { authenticateToken } from "../../security/authenticate";

const router = express.Router();

// Handle the delete request for selected payment methods
router.delete(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract selected IDs from the request body
      let selectedIds = req.body?.selectedIds || [];

      // Ensure selectedIds is an array
      if (typeof selectedIds === "string") {
        selectedIds = [selectedIds]; // Convert single ID to an array
      }

      // Check if selectedIds is an array and not empty
      if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
        res.status(400).json({ message: "No IDs provided for deletion" });
        return;
      }

      // Delete the selected discounts in the database
      const result = await Discount.deleteMany({
        _id: { $in: selectedIds },
      });

      if (!result.deletedCount) {
        res.status(404).send("No discounts found for deletion");
        return;
      }

      res.status(200).json({
        message: `${result.deletedCount} discount${
          result.deletedCount > 1 ? "s" : ""
        } deleted successfully`,
      });
      return;
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
      return;
    }
  }
);

export default router;
