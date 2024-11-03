import express, { Response, Router } from "express";
import User from "../models/user"; // Adjust import path if necessary
import { authenticateToken, RequestWithUser } from "./security/authenticate"; // Ensure this imports the correct type

const router: Router = express.Router();

router.post(
  "/",
  authenticateToken,
  async (req: RequestWithUser, res: Response): Promise<void> => {}
);

export default router; // Export the router
