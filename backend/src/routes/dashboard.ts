import express, { Response, Router, NextFunction } from "express";
import User from "../models/user"; // Adjust import path if necessary
import { authenticateToken, RequestWithUser } from "./security/authenticate"; // Ensure this imports the correct type

const router: Router = express.Router();

/* GET home page. */
router.get(
  "/",
  authenticateToken,
  async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user = req.user; // Accessing req.user

    if (user) {
      try {
        const foundUser = await User.findOne({ username: user.username });

        if (foundUser) {
          if (foundUser.setup) {
            res.redirect("/setup"); // Explicit return after redirect
          } else {
            res.render("dashboard", {
              access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS,
              site_title: "Dashboard",
              user: foundUser,
            });
          }
        } else {
          res.status(404).json({ message: "User not found." });
        }
      } catch (error) {
        next(error); // Pass the error to the next middleware
      }
    } else {
      res.redirect("/login"); // Redirect if user is not found
    }
  }
);

export default router; // Export the router
