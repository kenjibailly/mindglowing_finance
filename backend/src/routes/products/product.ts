import express, { Request, Response } from "express";
import Product from "../../models/product";
import User from "../../models/user";
import { authenticateToken } from "../security/authenticate";

const router = express.Router({ mergeParams: true });

// Get the project page by id
router.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    // Get the session user that's logged in
    const user = req.session.user;
    // Get the product ID
    const product_id = req.params.id;
    try {
      // Use the find method to get project by id
      const product = await Product.findOne({ _id: product_id });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Use the find method to get the user settings
      const userSettings = await User.findOne({ username: user?.username });
      if (!userSettings) {
        return res.status(404).json({ message: "User settings not found" });
      }

      const updatedProduct = {
        ...product.toObject(),
        currency_symbol: userSettings.currency_symbol,
      };

      // Return JSON data
      return res.json({
        product: updatedProduct,
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
