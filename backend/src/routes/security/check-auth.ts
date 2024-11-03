import express, { Request, Response, Router } from "express";
import { authenticateToken } from "./authenticate";

const router: Router = express.Router();

// Endpoint to check authentication
router.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    // Check if session or user info is available
    if (req.session && req.session.user) {
      logger.success("Authenticated");
      res.json({ isAuthenticated: true, user: req.session.user });
      return;
    } else {
      logger.warn("Not Authenticated");
      res.json({ isAuthenticated: false });
      return;
    }
  }
);

export default router; // Export the router
