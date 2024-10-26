import express, { Request, Response, Router } from "express";
import { authenticateToken } from "./authenticate";

const router: Router = express.Router();

// Endpoint to check authentication
router.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    // Check if session or user info is available
    if (req.session && req.session.user) {
      logger.success("Authenticated");
      return res.json({ isAuthenticated: true, user: req.session.user });
    } else {
      logger.warn("Not Authenticated");
      return res.json({ isAuthenticated: false });
    }
  }
);

export default router; // Export the router
