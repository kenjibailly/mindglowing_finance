import express, { Request, Response } from "express";
const router = express.Router();
import Product from "../../models/product";
import { authenticateToken } from "../security/authenticate";
import {
  upload,
  resizeAndCompressImage,
} from "../picture_handler/multerConfig";

interface CustomError extends Error {
  code?: number;
  keyPattern?: { [key: string]: number };
}

// Handle the POST request to add an product
router.post(
  "/",
  authenticateToken,
  upload,
  resizeAndCompressImage,
  async (req: Request, res: Response): Promise<any> => {
    // Extract form data from the request
    const { name, price, description } = req.body;

    try {
      // Create a new product instance with the form details
      const newProduct = new Product({
        name,
        price,
        description,
        picture: req.file ? req.file.filename : null,
      });

      // Save the product to the database
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      logger.error(error);
      const err = error as CustomError;
      // Check if the error is a duplicate key violation
      if (err.code === 11000 && err.keyPattern && err.keyPattern["name"]) {
        // Duplicate name error
        res
          .status(400)
          .json({ message: "Product with the same name already exists" });
      } else {
        // Other internal server error
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
);

export default router;
