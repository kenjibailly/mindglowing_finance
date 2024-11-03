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
            preserveNullAndEmptyArrays: true, // Keeps the project even if no customer is found
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
        // Calculate total time for timeTracking in seconds
        {
          $addFields: {
            total_time_seconds: {
              $reduce: {
                input: {
                  $map: {
                    input: "$timeTracking",
                    as: "entry",
                    in: {
                      $cond: {
                        if: { $ifNull: ["$$entry.stop", false] },
                        then: {
                          $divide: [
                            { $subtract: ["$$entry.stop", "$$entry.start"] },
                            1000,
                          ], // Stop - Start in seconds
                        },
                        else: {
                          $divide: [
                            { $subtract: [new Date(), "$$entry.start"] },
                            1000,
                          ], // Ongoing (current time - start)
                        },
                      },
                    },
                  },
                },
                initialValue: 0,
                in: { $add: ["$$value", "$$this"] },
              },
            },
          },
        },
        // Add formatted total_time to the project as well (for easy display) without fractional seconds
        {
          $addFields: {
            total_time: {
              $let: {
                vars: {
                  total_seconds: { $floor: "$total_time_seconds" }, // Correctly floor total_time_seconds to remove fraction
                  hours: {
                    $floor: {
                      $divide: [{ $floor: "$total_time_seconds" }, 3600],
                    },
                  },
                  minutes: {
                    $mod: [
                      {
                        $floor: {
                          $divide: [{ $floor: "$total_time_seconds" }, 60],
                        },
                      },
                      60,
                    ],
                  },
                  seconds: { $mod: [{ $floor: "$total_time_seconds" }, 60] }, // Floor seconds as well
                },
                in: {
                  $concat: [
                    { $toString: "$$hours" },
                    ":",
                    {
                      $cond: [
                        { $gte: ["$$minutes", 10] },
                        { $toString: "$$minutes" },
                        { $concat: ["0", { $toString: "$$minutes" }] },
                      ],
                    },
                    ":",
                    {
                      $cond: [
                        { $gte: ["$$seconds", 10] },
                        { $toString: "$$seconds" },
                        { $concat: ["0", { $toString: "$$seconds" }] },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        // Convert project.billed to "Yes" or "No"
        {
          $addFields: {
            billed: {
              $cond: {
                if: { $eq: ["$billed", true] },
                then: "Yes",
                else: "No",
              },
            },
          },
        },
        // Sort by the specified field, including the newly calculated total_time_seconds if needed
        {
          $sort: {
            [sort_by === "total_time" ? "total_time_seconds" : sort_by]:
              sort_order === "asc" ? 1 : -1, // Sort dynamically based on the field selected
            _id: 1, // Always sort by _id as the secondary key to ensure stable sorting
          },
        },
        // Apply pagination after sorting
        { $skip: skip },
        { $limit: itemsPerPage },
      ]);

      // Add the customer info to the projects array
      const updatedProjects = await Promise.all(
        projects.map(async (project) => {
          // Get the current time
          const currentTime = new Date();

          // Calculate total time tracking for the current project
          const timeTrackingArray = project.timeTracking.map(
            (entry: TimeTracking) => {
              // Ensure both are treated as timestamps in milliseconds
              let timePassed = Math.round(
                (currentTime.getTime() - entry.start.getTime()) / 1000
              ); // in seconds
              // Check if there's already a stop time, then format that time and change the timePassed
              var stop = "";
              if (entry.stop) {
                stop = formatDateTime(entry.stop, userSettings as UserType);
                timePassed = Math.round(
                  (entry.stop.getTime() - entry.start.getTime()) / 1000
                );
              }
              return {
                _id: entry._id,
                name: entry.name,
                start: formatDateTime(entry.start, userSettings as UserType),
                stop: stop,
                timePassed: formatTime(timePassed),
              };
            }
          );

          // Calculate the total time passed of all the time tracking for the current project
          const totalSeconds = timeTrackingArray.reduce(
            (total: number, entry: { timePassed: string }) => {
              const [hours, minutes, seconds] = entry.timePassed
                .split(":")
                .map(Number);
              return total + hours * 3600 + minutes * 60 + seconds;
            },
            0
          );

          // Use your formatTime function to get the formatted result
          const totalTimePassed = formatTime(totalSeconds);

          return {
            ...project,
            total_time: totalTimePassed, // Add total time to the project
          };
        })
      );

      res.json({
        success: true,
        items: updatedProjects,
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
