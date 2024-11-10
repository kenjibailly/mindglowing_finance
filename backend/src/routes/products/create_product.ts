import express, { Request, Response } from "express";
const router = express.Router();
import Product from "../../models/product";
import { authenticateToken } from "../security/authenticate";
import {
  upload,
  resizeAndCompressImage,
} from "../picture_handler/multerConfig";
import ErrorType from "../../types/error";

// Handle the POST request to add an product
router.post(
  "/",
  authenticateToken,
  upload,
  resizeAndCompressImage,
  async (req: Request, res: Response): Promise<void> => {
    // Extract form data from the request
    const { name, price, tax, tax_id, description } = req.body;
    logger.info(tax_id);

    try {
      // Create a new product instance with the form details
      const newProduct = new Product({
        name,
        price,
        "tax.id": tax_id,
        "tax.percentage": tax,
        description,
        picture: req.file ? req.file.filename : null,
      });

      // Save the product to the database
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
      return;
    } catch (error) {
      logger.error(error);
      const err = error as ErrorType;
      // Check if the error is a duplicate key violation
      if (err.code === 11000 && err.keyPattern && err.keyPattern["name"]) {
        // Duplicate name error
        res
          .status(400)
          .json({ message: "Product with the same name already exists" });
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
