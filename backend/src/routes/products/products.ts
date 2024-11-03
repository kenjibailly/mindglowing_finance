import express, { Request, Response } from "express";
import Product from "../../models/product";
import User from "../../models/user";
import Customization from "../../models/customization";
import { authenticateToken } from "../security/authenticate";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    // Get the session user that's logged in
    const user = req.session.user;

    const {
      sort_by = "created_on",
      sort_order = "asc",
      page = "1",
    } = req.query as {
      sort_by: string;
      sort_order: string;
      page?: string;
    };

    const pageNumber = parseInt(page, 10);

    const sortDirection = sort_order === "asc" ? 1 : -1;
    const sortOptions: Record<string, 1 | -1> = {};
    sortOptions[sort_by] = sortDirection;

    try {
      const userSettings = await User.findOne({ username: user?.username });
      const customizationSettings = await Customization.findOne();
      const itemsPerPage = customizationSettings?.items_per_page || 10;
      const skip = (pageNumber - 1) * itemsPerPage;

      const totalProducts = await Product.countDocuments();
      const totalPages = Math.ceil(totalProducts / itemsPerPage);

      const products = await Product.aggregate([
        // Sort by the specified field dynamically and also by _id in descending order
        {
          $sort: {
            [sort_by]: sortDirection, // Dynamic sorting by the specified field
            _id: -1, // Always sort by _id in descending order as a secondary key
          },
        },
        // Apply pagination after sorting
        { $skip: skip },
        { $limit: itemsPerPage },
      ]);

      const updatedProducts = products.map((product) => {
        return {
          ...product,
          currency_symbol: userSettings?.currency_symbol,
        };
      });

      res.json({
        success: true,
        items: updatedProducts,
        currentPage: pageNumber,
        totalPages,
        userSettings,
      });
      return;
    } catch (error) {
      logger.error(error);

      console.error(error);
      res.status(500).json({ success: false, error: (error as Error).message });
      return;
    }
  }
);

export default router;
