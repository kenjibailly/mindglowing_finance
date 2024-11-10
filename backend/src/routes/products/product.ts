import express, { Request, Response } from "express";
import Product from "../../models/product";
import User from "../../models/user";
import { authenticateToken } from "../security/authenticate";
import mongoose from "mongoose";

const router = express.Router({ mergeParams: true });

// Get the project page by id
router.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    // Get the session user that's logged in
    const user = req.session.user;
    // Get the product ID
    const product_id = req.params.id;
    try {
      // Use the find method to get project by id
      const product = await Product.aggregate([
        // Match the product by its ID
        { $match: { _id: new mongoose.Types.ObjectId(product_id) } },

        // Convert tax.id to ObjectId if it's a string (before the lookup)
        {
          $addFields: {
            "tax.id": { $toObjectId: "$tax.id" }, // Convert tax.id to ObjectId
          },
        },

        // Now perform the lookup with the converted tax.id field
        {
          $lookup: {
            from: "taxes", // The name of the Tax collection
            localField: "tax.id", // Now it's an ObjectId
            foreignField: "_id", // The field in Tax collection that matches the Product's tax.id
            as: "tax_details", // The new field to store the joined tax data
          },
        },

        // If taxDetails exist, unwind it to make it a direct object, not an array
        {
          $unwind: {
            path: "$tax_details",
            preserveNullAndEmptyArrays: true, // Preserve the Product if no tax is found
          },
        },

        // Optionally, project the desired fields (you can modify this as needed)
        {
          $project: {
            name: 1,
            price: 1,
            description: 1,
            picture: 1,
            tax: 1, // Keep the original tax field
            tax_details: 1, // Use the tax data from the lookup (now unwound)
          },
        },
      ]);

      // Ensure product exists after the aggregation
      if (product.length === 0) {
        throw new Error("Product not found");
      }

      // Use the find method to get the user settings
      const userSettings = await User.findOne({ username: user?.username });
      if (!userSettings) {
        res.status(404).json({ message: "User settings not found" });
        return;
      }

      // Return JSON data
      res.json(product[0]);
      return;
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
);

export default router;
