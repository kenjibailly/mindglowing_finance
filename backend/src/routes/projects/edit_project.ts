import express, { Request, Response } from "express";
import Project from "../../models/project";
import { authenticateToken } from "../security/authenticate";
import ErrorType from "../../types/error";

const router = express.Router();

// Handle the update request
router.put(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const projectId = req.params.id;
      logger.log(projectId);
      const { project_name, customer_id, description } = req.body;

      logger.warn(req.body);

      // Update the project in the database
      const result = await Project.findOneAndUpdate(
        { _id: projectId },
        { $set: { name: project_name, customer_id, description } },
        { new: true, runValidators: true } // This enables validation
      );

      if (!result) {
        res.status(404).send("Project not found");
        return;
      }

      res.status(201).json(result);
      return;
    } catch (error) {
      logger.error(error);
      const err = error as ErrorType;
      // Check if the error is a duplicate key violation
      if (err.code === 11000 && err.keyPattern && err.keyPattern["name"]) {
        // Duplicate name error
        res
          .status(400)
          .json({ message: "Item with the same name already exists" });
        return;
      } else {
        // Other internal server error
        res
          .status(500)
          .json({ message: "Internal Server Error" + err.message });
        return;
      }
    }
  }
);

export default router;
