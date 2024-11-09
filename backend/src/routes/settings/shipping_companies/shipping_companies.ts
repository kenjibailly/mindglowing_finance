import express, { Request, Response } from "express";
import ShippingCompany from "../../../models/shipping_company";
import { authenticateToken } from "../../security/authenticate";
import User from "../../../models/user";
import Customization from "../../../models/customization";

const router = express.Router();

/* GET /settings/shipping-companies/ page. */
router.get(
  "/",
  authenticateToken,
  async function (req: Request, res: Response): Promise<void> {
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
      if (!userSettings) {
        res.status(404).send("Could not find user");
        return;
      }
      const customizationSettings = await Customization.findOne();
      const itemsPerPage = customizationSettings?.items_per_page || 10;
      const skip = (pageNumber - 1) * itemsPerPage;

      const totalShippingCompanys = await ShippingCompany.countDocuments();
      const totalPages = Math.ceil(totalShippingCompanys / itemsPerPage);

      // Find the shipping companies
      const shipping_companys = await ShippingCompany.aggregate([
        // Sort and paginate shipping companies
        { $sort: sortOptions },
        {
          $skip: skip, // Pagination skip
        },
        {
          $limit: itemsPerPage, // Pagination limit
        },
      ]);

      if (!shipping_companys) {
        res.status(404).send("No shipping companies found");
        return;
      }

      res.status(200).json({ items: shipping_companys, totalPages });
      return;
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal server error");
      return;
    }
  }
);

export default router;
