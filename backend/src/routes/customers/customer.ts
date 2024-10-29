import express, { Request, Response, NextFunction, Router } from "express";
import Customer from "../../models/customer";
import User from "../../models/user";
import { authenticateToken } from "../security/authenticate";

const router: Router = express.Router();

// Get the project page by id
router.get(
  "/:id",
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

      // Fetch user settings based on the session username
      const userSettings = await User.findOne({ username: user.username });
      if (!userSettings) {
        return res.status(404).json({ message: "User settings not found" });
      }

      // Return JSON data instead of rendering
      return res.json({
        user: userSettings,
        customer: customer,
        access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
        site_title: "Customer",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
