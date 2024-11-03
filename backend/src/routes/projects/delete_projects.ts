import express, { Request, Response } from "express";
const router = express.Router();
import Project from "../../models/project";
import { authenticateToken } from "../security/authenticate";

// Handle the delete request for selected projects
router.delete(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract selected IDs from the request body
      let selectedIds = req.body?.selectedIds || [];

      // Ensure selectedIds is an array
      if (typeof selectedIds === "string") {
        selectedIds = [selectedIds]; // Convert single ID to an array
      }

      // Check if selectedIds is an array and not empty
      if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
        res.status(400).json({ message: "No IDs provided for deletion" });
        return;
      }

      // Delete the selected projects in the database
      const result = await Project.deleteMany({ _id: { $in: selectedIds } });

      if (!result.deletedCount) {
        res.status(404).send("No projects found for deletion");
        return;
      }

      // Send a JSON response with a success message
      res.status(200).json({
        message: `${result.deletedCount} project${
          result.deletedCount > 1 ? "s" : ""
        } deleted successfully`,
      });
      return;
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
      return;
    }
  }
);

export default router;
