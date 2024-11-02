import express, { Request, Response, NextFunction } from "express";
import Customer from "../../models/customer";
import User from "../../models/user";
import Customization from "../../models/customization";
import { authenticateToken } from "../security/authenticate";
import formatDate from "../formatters/date_formatter";

const router = express.Router();

// GET /customers
router.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = req.session.user;

    if (!user) {
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

      const totalCustomers = await Customer.countDocuments();
      const totalPages = Math.ceil(totalCustomers / itemsPerPage);

      const customers = await Customer.aggregate([
        {
          $lookup: {
            from: "invoices",
            let: { customerId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toObjectId: "$customer_id" }, "$$customerId"],
                  },
                },
              },
            ],
            as: "invoices_details",
          },
        },
        {
          $addFields: {
            customer_name: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ["$personal_information.company", ""] },
                    { $eq: ["$personal_information.company", null] },
                  ],
                },
                then: {
                  $concat: [
                    "$personal_information.first_name",
                    " ",
                    "$personal_information.last_name",
                  ],
                },
                else: "$personal_information.company",
              },
            },
            amount_due: {
              $round: [
                {
                  $sum: {
                    $map: {
                      input: "$invoices_details",
                      as: "invoice",
                      in: { $ifNull: ["$$invoice.amount_due", 0] },
                    },
                  },
                },
                2,
              ],
            },
          },
        },
        { $sort: sortOptions },
        { $skip: skip },
        { $limit: itemsPerPage },
      ]);

      const updatedCustomers = customers.map((customer) => {
        const safeUserSettings = userSettings || {
          date_format: "en-US",
          time_zone: undefined,
        };

        return {
          ...customer,
          created_on: formatDate(customer.created_on, {
            time_zone: safeUserSettings.time_zone,
            date_format: safeUserSettings.date_format || "en-US",
          }),
          user: safeUserSettings,
        };
      });

      return res.json({
        success: true,
        items: updatedCustomers,
        currentPage: pageNumber,
        totalPages,
        userSettings,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, error: (error as Error).message });
    }
  }
);

router.get(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = req.session.user;
    const customerId = req.params.id;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
      // Fetch the customer by ID
      const customer = await Customer.findOne({ _id: customerId });
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      // Fetch user settings based on the session username
      const userSettings = await User.findOne({ username: user.username });
      if (!userSettings) {
        return res.status(404).json({ message: "User settings not found" });
      }

      // Return JSON data instead of rendering
      return res.json({
        user: userSettings,
        customer: customer,
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
        site_title: "Customer",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
