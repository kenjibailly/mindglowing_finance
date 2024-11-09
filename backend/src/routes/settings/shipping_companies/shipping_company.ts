import express, { Request, Response } from "express";
import ShippingCompany from "../../../models/shipping_company";
import { authenticateToken } from "../../security/authenticate";

const router = express.Router({ mergeParams: true });

// Handle the update request
router.get(
  "/",
  authenticateToken,
  async function (req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    try {
      const shippingCompany = await ShippingCompany.findById(id);
      if (!shippingCompany) {
        res.status(404).send("Could not find payment method");
        return;
      }

      res.status(200).json(shippingCompany);
      return;
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal server error");
      return;
    }
  }
);

export default router;
