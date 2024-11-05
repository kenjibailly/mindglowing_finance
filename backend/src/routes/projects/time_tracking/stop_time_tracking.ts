import express, { Request, Response } from "express";
import TimeTrackings from "../../../models/time_trackings";
import { authenticateToken } from "../../security/authenticate";

const router = express.Router({ mergeParams: true });

// Handle the POST request to update a project and add time tracking
router.patch(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const projectId = req.params.projectId; // Use req.params.id to get the project ID from the route parameters
      const id = req.params.id;

      // Fetch the existing project by its ID
      const timeTracking = await TimeTrackings.findById(id);

      if (!timeTracking) {
        res.status(404).json({ message: "Time Tracking not found" });
        return;
      }

      // Update the stop time for the found timeTracking entry
      timeTracking.stop = new Date();

      // Save the updated project with the modified timeTracking entry
      await timeTracking.save();

      res.status(200).send("Time tracking stopped");
      return;
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  }
);

export default router;
