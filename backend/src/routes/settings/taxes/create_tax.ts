import express, { Request, Response } from "express";
import Tax from "../../../models/tax";
import { authenticateToken } from "../../security/authenticate";
import ErrorType from "../../../types/error";

const router = express.Router();

// Handle the POST request to add a tax
router.post(
  "/",
  authenticateToken,
  async function (req: Request, res: Response) {
    // Extract form data from the request
    const { tax_name, tax_description, tax_percentage } = req.body;
    const tax_default = req.body.tax_default === "on";

    // Create a new tax instance with the form details
    const newTax = new Tax({
      name: tax_name,
      percentage: tax_percentage,
      default: tax_default,
      description: tax_description,
    });

    try {
      // Save the tax to the database
      const savedTax = await newTax.save();
      if (!savedTax) {
        res.status(400).send("Could not add new tax");
        return;
      }
      res.status(200).json(savedTax);
      return;
    } catch (error) {
      logger.error(error);

      const err = error as ErrorType;

      // Check if the error is a duplicate key violation
      if (err.code === 11000 && err.keyPattern && err.keyPattern["name"]) {
        // Duplicate name error
        res.status(400).json({
          message: "Tax with the same name already exists",
        });
        return;
      } else if (
        err.code === 11000 &&
        err.keyPattern &&
        err.keyPattern["default"]
      ) {
        // Duplicate name error
        res.status(400).json({
          message: "Another tax has already been set to the default",
        });
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
