import express, { Request, Response } from "express";
import TimeTrackings from "../../../models/time_trackings";
import { authenticateToken } from "../../security/authenticate";

const router = express.Router({ mergeParams: true });

interface CustomError extends Error {
  code?: number;
  keyPattern?: { [key: string]: number };
}

// Handle the POST request to update a project and add time tracking
router.post(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const projectId = req.params.projectId;
      // Extract form data from the request
      const { time_tracking_name } = req.body;

      if (!time_tracking_name) {
        res.status(400).send("No time tracking name provided!");
        return;
      }

      // Create a new time tracking entry with the current date and time
      const newTimeTracking = new TimeTrackings({
        name: time_tracking_name,
        project_id: projectId,
        start: new Date(),
      });

      await newTimeTracking.save();

      res.status(200).send("Time tracking successfully created!");
    } catch (error) {
      logger.error(error);
      const err = error as CustomError;
      // Check if the error is a duplicate key violation
      if (err.code === 11000 && err.keyPattern && err.keyPattern["name"]) {
        // Duplicate name error
        res
          .status(400)
          .json({ message: "Time Tracking with the same name already exists" });
        return;
      } else {
        // Other internal server error
        res.status(500).json({ message: "Internal Server Error" });
        return;
      }
    }
  }
);

export default router;
