import express, { Request, Response } from "express";
import Project from "../../models/project";
import mongoose from "mongoose";
import Invoice from "../../models/invoice";
import Customization from "../../models/customization";
import { authenticateToken } from "../security/authenticate";

const router = express.Router({ mergeParams: true });

// Get the project page by id
router.get(
  "/",
  authenticateToken,
  async function (req: Request, res: Response): Promise<void> {
    const project_id = req.params.id;
    logger.warn(project_id);
    try {
      const projectObjectId = new mongoose.Types.ObjectId(project_id);
      const project = await Project.aggregate([
        {
          $match: {
            _id: projectObjectId, // Find the project with this specific _id
          },
        },
        {
          $addFields: {
            customer_id: { $toObjectId: "$customer_id" }, // Only if customer_id is stored as a string
          },
        },
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
      ]);

      const singleProject = project[0];
      const customer_name = project[0].customer_name;

      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }

      // Use the find method to get the customization settings
      const customizationSettings = await Customization.findOne();

      // Find the invoice which is billed
      const invoice = await Invoice.findOne(
        { "project_billed.id": project_id }, // Filter by project_billed.id
        { _id: 1, number: 1 } // Project only the _id and number fields
      );

      res.json({
        project: singleProject,
        invoice: invoice,
        customer_name: customer_name,
        customizationSettings: customizationSettings,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: (error as Error).message });
      return;
    }
  }
);

export default router;
