import express, { Request, Response, Router } from "express";
import { authenticateToken } from "./security/authenticate";
import User from "../models/user";

const router: Router = express.Router();

// Endpoint to check authentication
router.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    // Check if session or user info is available
    if (req.session && req.session.user) {
      try {
        const user = await User.findById(req.session.user.id);
        return res.json(user);
      } catch (error) {
        return res.json({ error: "Could not get user info" });
      }
    }
  }
);

export default router;
