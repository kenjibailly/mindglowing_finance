import express, { Request, Response, Router, RequestHandler } from "express";
import Customer from "../../models/customer";
import Invoice from "../../models/invoice";
import Product from "../../models/product";
import Project from "../../models/project";
import Customization from "../../models/customization";
import { Document } from "mongoose";
import { authenticateToken } from "../security/authenticate";

const router: Router = express.Router();

interface SearchQuery extends Request {
  query: {
    q?: string;
  };
}

interface CustomizationSettings extends Document {
  invoice_prefix: string;
  invoice_separator: string;
}

router.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    const searchTerm = typeof req.query.q === "string" ? req.query.q : "";
    try {
      // Search in the Customer collection
      const customers = await Customer.find({
        $or: [
          { "personal_information.first_name": new RegExp(searchTerm, "i") },
          { "personal_information.last_name": new RegExp(searchTerm, "i") },
          { "personal_information.email": new RegExp(searchTerm, "i") },
        ],
      });

      // Use the find method to get the customization settings
      const customizationSettings =
        (await Customization.findOne()) as CustomizationSettings;
      const invoicePrefix =
        customizationSettings.invoice_prefix +
        customizationSettings.invoice_separator;
      const searchTermWithoutPrefix = searchTerm.startsWith(invoicePrefix)
        ? searchTerm.substring(invoicePrefix.length)
        : searchTerm;

      // Search in the Invoice collection
      const invoices = await Invoice.find({
        $or: [
          {
            number: isNaN(Number(searchTermWithoutPrefix))
              ? null
              : Number(searchTermWithoutPrefix),
          },
          { description: new RegExp(searchTerm, "i") },
        ],
      });

      // Search in the Product collection
      const products = await Product.find({
        $or: [
          { name: new RegExp(searchTerm, "i") },
          { description: new RegExp(searchTerm, "i") },
        ],
      });

      // Search in the Project collection
      const projects = await Project.find({
        $or: [
          { name: new RegExp(searchTerm, "i") },
          { description: new RegExp(searchTerm, "i") },
        ],
      });

      return res.json({
        search_results: { customers, products, invoices, projects },
        customization_settings: customizationSettings,
      });
    } catch (error) {
      console.error("Error searching:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

export default router;
