import express, { Request, Response } from "express";
import User from "../../../models/user";
import TimeTracking from "../../../models/time_trackings";
import Customization from "../../../models/customization";
import { authenticateToken } from "../../security/authenticate";
import formatDateTime from "../../formatters/date_time_formatter";
import formatTime from "../../formatters/time_formatter";
import { TimeTracking as TimeTrackingType } from "../../../types/projects";
import { User as UserType } from "src/types/user";

const router = express.Router({ mergeParams: true });

// Get the project page by id
router.get(
  "/",
  authenticateToken,
  async function (req: Request, res: Response): Promise<void> {
    // Get the session user that's logged in
    const user = req.session.user;
    const project_id = req.params.projectId;
    const {
      sort_by = "stop",
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

    const totalTimeTrackingEntries = await TimeTracking.countDocuments({
      project_id: project_id,
    });

    // Get the current time
    const currentTime = new Date();

    try {
      const userSettings = await User.findOne({ username: user?.username });
      if (!userSettings) {
        res.status(404).json({ message: "Could not find user" });
        return;
      }
      const customizationSettings = await Customization.findOne();
      const itemsPerPage = customizationSettings?.items_per_page || 10;
      const totalPages = Math.ceil(totalTimeTrackingEntries / itemsPerPage);
      const skip = (pageNumber - 1) * itemsPerPage;

      const timeTrackings = await TimeTracking.aggregate([
        {
          $match: {
            project_id: project_id,
          },
        },
        {
          $addFields: {
            duration_seconds: {
              $cond: {
                if: { $ifNull: ["$stop", false] },
                then: { $divide: [{ $subtract: ["$stop", "$start"] }, 1000] },
                else: {
                  $divide: [{ $subtract: [currentTime, "$start"] }, 1000],
                },
              },
            },
          },
        },
        {
          $facet: {
            total: [
              {
                $group: {
                  _id: null, // Group by null to get a single result
                  total_time: { $sum: "$duration_seconds" }, // Calculate total time
                },
              },
              {
                $project: {
                  _id: 0, // Exclude the _id field
                  total_time: 1, // Include total_time
                },
              },
            ],
            timeTrackings: [
              // Sort by the specified field, including the newly calculated total_time_seconds if needed
              {
                $sort: {
                  [sort_by === "total_time" ? "total_time_seconds" : sort_by]:
                    sort_order === "asc" ? 1 : -1, // Sort dynamically based on the field selected
                  _id: 1, // Always sort by _id as the secondary key to ensure stable sorting
                },
              },
              {
                $skip: skip, // Skip for pagination
              },
              {
                $limit: itemsPerPage, // Limit for pagination
              },
            ],
          },
        },
        {
          $project: {
            total_time: { $arrayElemAt: ["$total.total_time", 0] }, // Get the total_time directly
            timeTrackings: 1,
          },
        },
      ]);

      const timeTrackingEntries = timeTrackings[0].timeTrackings;
      const totalTime = formatTime(timeTrackings[0].total_time);

      const timeTrackingArray = timeTrackingEntries.map(
        (entry: TimeTrackingType) => {
          let totalTime = entry.duration_seconds;
          // Check if there's already a stop time, then format that time and change the totalTime
          let stop = "";
          if (entry.stop) {
            stop = formatDateTime(entry.stop, userSettings as UserType);
            totalTime = entry.duration_seconds;
          }
          return {
            _id: entry._id,
            name: entry.name, // Assuming you have a 'name' property in your timeTracking entry
            start: formatDateTime(entry.start, userSettings as UserType),
            stop: stop,
            totalTime: formatTime(totalTime),
          };
        }
      );

      res.json({
        success: true,
        items: timeTrackingArray,
        totalTime: totalTime,
        currentPage: pageNumber,
        totalPages,
        userSettings,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: (error as Error).message });
      return;
    }
  }
);

export default router;
