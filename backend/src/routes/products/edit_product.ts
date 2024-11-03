import express, { Request, Response } from "express";
import Product from "../../models/product";
import { authenticateToken } from "../security/authenticate";
import {
  upload,
  resizeAndCompressImage,
} from "../picture_handler/multerConfig";
import deleteImageFile from "../picture_handler/deleteImageFile";

const router = express.Router();

// Handle the update request
router.put(
  "/:id",
  authenticateToken,
  upload,
  resizeAndCompressImage,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const productId = req.params.id;
      const { name, price, description } = req.body;

      // Find the product to get the image file name
      const old_product = await Product.findById(productId);

      if (!old_product) {
        res.status(404).send("Product not found");
        return;
      }

      var picture;
      // Check if a file was uploaded
      if (req.file) {
        picture = req.file.filename;
        // Otherwise keep the old picture
      } else {
        picture = old_product.picture;
      }

      // If the product had a picture and there's a new one
      if (old_product.picture && req.file) {
        // Delete the image file
        await deleteImageFile(old_product.picture);
      }

      // Update the product in the database
      const result = await Product.findByIdAndUpdate(
        productId,
        { $set: { name, price, description, picture } },
        { new: true }
      );

      if (!result) {
        res.status(404).send("Product not found");
        return;
      }

      res.status(200).json({ message: "Product edited successfully!" });
      return;
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
      return;
    }
  }
);

export default router;
