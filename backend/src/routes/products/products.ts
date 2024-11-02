import express, { Request, Response } from "express";
import Product from "../../models/product";
import User from "../../models/user";
import Customization from "../../models/customization";
import { authenticateToken } from "../security/authenticate";

const router = express.Router();

// /* GET /customers page. */
// router.get('/', authenticateToken, async function(req, res, next) {
//   // Get the session user that's logged in
//   const user = req.session.user;
//   // If the user is logged in
//   if(!user) {
//       // Render the login page
//       return res.redirect('/login');
//   }

//   const { page = 1 } = req.query;

//   try {

//     // Use the find method to get the user settings
//     const user_settings = await User.findOne({ username: user.username });

//     // Use the find method to get the customization settings
//     const customization_settings = await Customization.findOne();

//     // Calculate the number of items to skip based on the page
//     const skip = (page - 1) * customization_settings.items_per_page;

//     const products = await Product.aggregate([
//       // Sort by the specified field, and add _id as a secondary sort key
//       {
//         $sort: {
//           _id: -1 // Always sort by _id as the secondary key to ensure stable sorting
//         }
//       },
//       // Apply pagination after sorting
//       { $skip: skip },
//       { $limit: customization_settings.items_per_page }
//     ]);

//     // Count the total number of invoices
//     const totalProducts = await Product.countDocuments();

//     // Calculate total pages
//     const totalPages = Math.ceil(totalProducts / customization_settings.items_per_page);

//     res.render('products/products', {
//       user: user_settings,
//       products: products,
//       currentPage: parseInt(page),
//       totalPages: totalPages,
//       access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
//       site_title: 'Products',
//     });
//   } catch (error) {
//     logger.error(error);
//     // Render the products page
//     return res.render('products/products', {
//       access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
//       site_title: 'Products',
//       error: error,
//     });
//   }

// });

router.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    // Get the session user that's logged in
    const user = req.session.user;
    // If the user is logged in
    if (!user) {
      // Render the login page
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

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
      const userSettings = await User.findOne({ username: user.username });
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

      return res.json({
        success: true,
        items: updatedProducts,
        currentPage: pageNumber,
        totalPages,
        userSettings,
      });
    } catch (error) {
      logger.error(error);

      console.error(error);
      return res
        .status(500)
        .json({ success: false, error: (error as Error).message });
    }
  }
);

// Get the project page by id
router.get(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    // Get the session user that's logged in
    const user = req.session.user;
    // Get the product ID
    const product_id = req.params.id;
    // If the user is logged in
    if (!user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    try {
      // Use the find method to get project by id
      const product = await Product.findOne({ _id: product_id });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Use the find method to get the user settings
      const userSettings = await User.findOne({ username: user.username });
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
