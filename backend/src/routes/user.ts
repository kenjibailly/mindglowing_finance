import express, { Request, Response, Router } from "express";
import { authenticateToken } from "./security/authenticate";
import User from "../models/user";

const router: Router = express.Router();

// Endpoint to check authentication
router.get(
  "/",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    // Check if session or user info is available
    if (req.session && req.session.user) {
      try {
        const user = await User.findById(req.session.user.id);
        if (!user) {
          res.status(404).send("User not found!");
          return;
        }
        const { password, ...userWithoutPassword } = user.toObject();
        res.json(userWithoutPassword);
        return;
      } catch (error) {
        logger.error(error);
        res.json({ error: "Could not get user info" });
        return;
      }
    }
  }
);

export default router;
