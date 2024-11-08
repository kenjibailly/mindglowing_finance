import express, { Request, Response } from "express";
import Customization from "../../../models/customization";
import User from "../../../models/user";
import { authenticateToken } from "../../security/authenticate";

const router = express.Router();

/* GET /settings/customization/ page. */
router.get(
  "/",
  authenticateToken,
  async function (req: Request, res: Response): Promise<void> {
    try {
      // Find the customization settings
      const customization = await Customization.findOne();

      if (!customization) {
        res.status(404).send("Customization settings not found");
        return;
      }

      res.status(201).json(customization);
      return;
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
      return;
    }
  }
);

// Handle the update request
router.put(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        invoice_prefix,
        invoice_separator,
        estimate_prefix,
        estimate_separator,
        items_per_page,
      } = req.body;

      logger.info(
        invoice_prefix,
        invoice_separator,
        estimate_prefix,
        estimate_separator,
        items_per_page
      );

      // Update the customization settings in the database
      const query = {}; // Empty query matches all documents
      const update = {
        $set: {
          invoice_prefix: invoice_prefix,
          invoice_separator: invoice_separator,
          estimate_prefix: estimate_prefix,
          estimate_separator: estimate_separator,
          items_per_page: items_per_page,
        },
      };

      const result = await Customization.findOneAndUpdate(query, update, {
        new: true,
        runValidators: true,
      });

      // Check if the customization object was found and updated
      if (!result) {
        res.status(404).send("Customization not found.");
      }

      res.status(201).send(result);
      return;
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

export default router;
