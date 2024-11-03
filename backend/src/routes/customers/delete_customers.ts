import express, { Request, Response } from "express";
const router = express.Router();
import Customer from "../../models/customer";
import { authenticateToken } from "../security/authenticate";

// Handle the delete request for selected customers
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

      // Delete the selected customers in the database
      const result = await Customer.deleteMany({ _id: { $in: selectedIds } });

      if (result.deletedCount === 0) {
        res.status(404).json({ message: "No customers found for deletion" });
        return;
      }

      // Send a JSON response with a success message
      res.status(200).json({
        message: `${result.deletedCount} product${
          result.deletedCount > 1 ? "s" : ""
        } deleted successfully`,
      });
      return;
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  }
);

export default router;
