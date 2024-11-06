import express, { Request, Response } from "express";
import Project from "../../models/project";
import { authenticateToken } from "../security/authenticate";
import ErrorType from "../../types/error";
const router = express.Router();

// Handle the POST request to add a project
router.post(
  "/",
  authenticateToken,
  async function (req: Request, res: Response): Promise<void> {
    // Extract form data from the request
    const { project_name, customer_id, description } = req.body;
    try {
      // Create a new item instance with the form details
      const newProject = new Project({
        name: project_name,
        customer_id,
        description,
      });

      // Save the item to the database
      const savedProject = await newProject.save();
      res.status(201).json(savedProject);
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
