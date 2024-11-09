import express, { Request, Response } from "express";
import Discount from "../../../models/discount";
import { authenticateToken } from "../../security/authenticate";

const router = express.Router({ mergeParams: true });

// Handle the update request
router.get(
  "/",
  authenticateToken,
  async function (req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    try {
      const discount = await Discount.findById(id);
      if (!discount) {
        res.status(404).send("Could not find discount");
        return;
      }

      res.status(200).json(discount);
      return;
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal server error");
      return;
    }
  }
);

export default router;
