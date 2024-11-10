import express, { Request, Response } from "express";
import Invoice from "../../models/invoice";
import User from "../../models/user";
import { authenticateToken } from "../security/authenticate";
import formatDate from "../formatters/date_formatter";
import Customization from "../../models/customization";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    // Get the session user that's logged in
    const user = req.session.user;

    const {
      sort_by = "over_due",
      sort_order = "desc",
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

      const totalInvoices = await Invoice.countDocuments();
      const totalPages = Math.ceil(totalInvoices / itemsPerPage);

      const updatedInvoicesWithCustomerInfo = await Invoice.aggregate([
        // Convert customer_id to ObjectId if stored as a string
        {
          $addFields: {
            customer_id: { $toObjectId: "$customer_id" }, // Only if customer_id is stored as a string
          },
        },
        // Join with Customer collection to get customer details
        {
          $lookup: {
            from: "customers",
            localField: "customer_id",
            foreignField: "_id",
            as: "customer_details",
          },
        },
        {
          $unwind: {
            path: "$customer_details",
            preserveNullAndEmptyArrays: true, // Keeps the invoice even if no customer is found
          },
        },
        // Add a new field customer_name based on personal_information from the customer_details
        {
          $addFields: {
            customer_name: {
              $cond: {
                if: {
                  $or: [
                    {
                      $eq: [
                        "$customer_details.personal_information.company",
                        "",
                      ],
                    },
                    {
                      $eq: [
                        "$customer_details.personal_information.company",
                        null,
                      ],
                    },
                  ],
                },
                then: {
                  $concat: [
                    "$customer_details.personal_information.first_name",
                    " ",
                    "$customer_details.personal_information.last_name",
                  ],
                },
                else: "$customer_details.personal_information.company",
              },
            },
          },
        },
        // Add a new field over_due based on due_date and amount_due conditions
        {
          $addFields: {
            over_due: {
              $and: [
                { $lt: ["$due_date", new Date()] }, // Checks if due_date is in the past
                { $gt: ["$amount_due", 0] }, // Checks if amount_due is greater than 0
              ],
            },
          },
        },
        // Sort by the specified field, and add _id as a secondary sort key
        {
          $sort: {
            [sort_by]: sort_order === "asc" ? 1 : -1, // Sort dynamically based on the field selected
            _id: 1, // Always sort by _id as the secondary key to ensure stable sorting
          },
        },
        // Apply pagination after sorting
        { $skip: skip },
        { $limit: itemsPerPage },
      ]);

      const safeUserSettings = userSettings || {
        date_format: "en-US",
        time_zone: undefined,
      };

      // Format the invoice dates before returning
      const updatedInvoices = updatedInvoicesWithCustomerInfo.map(
        (invoice) => ({
          ...invoice,
          created_on: formatDate(invoice.created_on, {
            time_zone: safeUserSettings.time_zone,
            date_format: safeUserSettings.date_format || "en-US",
          }),
          due_date: formatDate(invoice.due_date, {
            time_zone: safeUserSettings.time_zone,
            date_format: safeUserSettings.date_format || "en-US",
          }),
        })
      );

      res.json({
        user_settings: userSettings,
        customization_settings: customizationSettings,
        items: updatedInvoices,
        currentPage: pageNumber,
        totalPages,
        userSettings,
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: (error as Error).message });
      return;
    }
  }
);

export default router;
