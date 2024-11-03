import express, { Request, Response, NextFunction } from "express";
import Customer from "../../models/customer";
import { authenticateToken } from "../security/authenticate";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = req.session.user;
    const customerId = req.params.id;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
      // Fetch the customer by ID
      const customer = await Customer.findOne({ _id: customerId });
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      // Return JSON data
      return res.json({
        customer: customer,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
