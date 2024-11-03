import express, { Request, Response } from "express";
const router = express.Router();
import Product from "../../models/product";
import { authenticateToken } from "../security/authenticate";
import deleteImageFile from "../picture_handler/deleteImageFile";

// Handle the delete request for selected products
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

      // Find the products to get the image file names
      const products = await Product.find({ _id: { $in: selectedIds } });

      // Delete the image files
      await Promise.all(
        products.map((product) => deleteImageFile(product.picture))
      );

      // Delete the selected products in the database
      const result = await Product.deleteMany({ _id: { $in: selectedIds } });

      if (!result.deletedCount) {
        res.status(404).send("No products found for deletion");
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
