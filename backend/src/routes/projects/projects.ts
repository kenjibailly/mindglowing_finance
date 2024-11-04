import express, { Request, Response } from "express";
import Project from "../../models/project";
import User from "../../models/user";
import Customization from "../../models/customization";
import { authenticateToken } from "../security/authenticate";
import formatTime from "../formatters/time_formatter";
import formatDateTime from "../formatters/date_time_formatter";
import { TimeTracking } from "../../types/projects";
import { User as UserType } from "../../types/user";

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
      if (!userSettings) {
        res.status(404).json({ message: "Could not find user" });
        return;
      }
      const customizationSettings = await Customization.findOne();
      const itemsPerPage = customizationSettings?.items_per_page || 10;
      const skip = (pageNumber - 1) * itemsPerPage;

      const totalProjects = await Project.countDocuments();
      const totalPages = Math.ceil(totalProjects / itemsPerPage);

      const projects = await Project.aggregate([
        {
          $project: {
            _id: { $toString: "$_id" },
            name: 1,
            customer_id: {
              $toObjectId: "$customer_id",
            },
            billed: 1,
            created_on: 1,
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "customer_id",
            foreignField: "_id",
            as: "customer",
            pipeline: [
              {
                $project: {
                  "personal_information.first_name": 1,
                  "personal_information.last_name": 1,
                  "personal_information.company": 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            customer: {
              $arrayElemAt: ["$customer", 0],
            },
          },
        },
        {
          $addFields: {
            customer_name: {
              $cond: {
                if: {
                  $or: [
                    {
                      $eq: ["$customer.personal_information.company", ""],
                    },
                    {
                      $eq: ["$customer.personal_information.company", null],
                    },
                  ],
                },
                then: {
                  $concat: [
                    "$customer.personal_information.first_name",
                    " ",
                    "$customer.personal_information.last_name",
                  ],
                },
                else: "$customer.personal_information.company",
              },
            },
          },
        },
        {
          $lookup: {
            as: "timetrackings",
            from: "timetrackings",
            foreignField: "project_id",
            localField: "_id",
          },
        },
        {
          $addFields: {
            total_time_seconds: {
              $reduce: {
                input: {
                  $map: {
                    input: "$timetrackings",
                    as: "entry",
                    in: {
                      $cond: {
                        if: {
                          $and: [
                            {
                              $ifNull: ["$$entry.start", false],
                            },
                            {
                              $ifNull: ["$$entry.stop", false],
                            },
                          ],
                        },
                        then: {
                          $divide: [
                            {
                              $subtract: ["$$entry.stop", "$$entry.start"],
                            },
                            1000,
                          ],
                        },
                        else: 0,
                      },
                    },
                  },
                },
                initialValue: 0,
                in: { $add: ["$$value", "$$this"] },
              },
            },
            billed: {
              $cond: {
                if: { $eq: ["$billed", true] },
                then: "Yes",
                else: "No",
              },
            },
          },
        },
        {
          $addFields: {
            total_time: {
              $concat: [
                {
                  $toString: {
                    $floor: {
                      $divide: ["$total_time_seconds", 3600],
                    },
                  },
                },
                "h ",
                {
                  $toString: {
                    $floor: {
                      $mod: [
                        {
                          $divide: ["$total_time_seconds", 60],
                        },
                        60,
                      ],
                    },
                  },
                },
                "m ",
                {
                  $toString: {
                    $floor: {
                      $mod: ["$total_time_seconds", 60],
                    },
                  },
                },
                "s",
              ],
            },
          },
        },
        // Sort and paginate projects
        {
          $sort: {
            [sort_by === "total_time" ? "total_time_seconds" : sort_by]:
              sort_order === "asc" ? 1 : -1,
            _id: 1, // Secondary sort by _id for stable sorting
          },
        },
        {
          $skip: skip, // Pagination skip
        },
        {
          $limit: itemsPerPage, // Pagination limit
        },
        {
          $project: {
            _id: 1,
            name: 1,
            customer_name: 1,
            total_time: 1,
            created_on: 1,
            billed: 1,
          },
        },
      ]);

      res.json({
        success: true,
        items: projects,
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
