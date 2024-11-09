import express, { Request, Response } from "express";
import ShippingCompany from "../../../models/shipping_company";
import { authenticateToken } from "../../security/authenticate";
import ErrorType from "../../../types/error";

const router = express.Router();

// Handle the POST request to add a shipping company
router.post(
  "/",
  authenticateToken,
  async function (req: Request, res: Response) {
    // Extract form data from the request
    const { shipping_company_name, shipping_company_description } = req.body;

    // Create a new shipping company instance with the form details
    const newShippingCompany = new ShippingCompany({
      name: shipping_company_name,
      description: shipping_company_description,
    });

    try {
      // Save the shipping company to the database
      const savedShippingCompany = await newShippingCompany.save();
      if (!savedShippingCompany) {
        res.status(400).send("Could not add new shipping company");
        return;
      }
      res.status(200).json(savedShippingCompany);
      return;
    } catch (error) {
      logger.error(error);

      const err = error as ErrorType;

      // Check if the error is a duplicate key violation
      if (err.code === 11000 && err.keyPattern && err.keyPattern["name"]) {
        // Duplicate name error
        res.status(400).json({
          message: "Shipping company with the same name already exists",
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
