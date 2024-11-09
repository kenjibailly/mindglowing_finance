import express, { Request, Response } from "express";
import ShippingCompany from "../../../models/shipping_company";
import { authenticateToken } from "../../security/authenticate";

const router = express.Router();

// Handle the update request
router.put(
  "/:id",
  authenticateToken,
  async function (req: Request, res: Response): Promise<void> {
    try {
      const shipping_company_id = req.params.id;
      const { shipping_company_name, shipping_company_description } = req.body;

      // Find the old shipping company
      const old_shipping_company = await ShippingCompany.findById(
        shipping_company_id
      );

      if (!old_shipping_company) {
        res.status(404).send("Shipping company not found");
        return;
      }

      // Update the shipping company in the database
      const result = await ShippingCompany.findByIdAndUpdate(
        shipping_company_id,
        {
          $set: {
            name: shipping_company_name,
            description: shipping_company_description,
          },
        },
        { new: true, runValidators: true }
      );

      if (!result) {
        res.status(404).send("Shipping company not found");
        return;
      }

      res.status(201).json(result);
      return;
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

export default router;
