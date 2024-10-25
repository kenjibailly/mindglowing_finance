import express, { Request, Response, NextFunction } from "express";
import { Router } from "express";
import User from "../models/user"; // Adjust the path if necessary
import jwt from "jsonwebtoken";
import config from "config";
import crypto from "crypto"; // Import the crypto module

const router: Router = express.Router();

/* POST login. */
router.post(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { username, password } = req.body;

    // Check if user is already logged in
    if (req.session.user) {
      return res.status(200).json({ message: "Already logged in" });
    }

    try {
      // Find the user in the database
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Hash the entered password
      const hashedEnteredPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      // Check if the hashed password matches
      if (user.password !== hashedEnteredPassword) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Generate JWT tokens
      const accessToken = jwt.sign(
        { username: user.username },
        process.env.SECRET_KEY as string,
        { expiresIn: `${process.env.VITE_ACCESS_TOKEN_EXPIRY_IN_SECONDS}s` }
      );
      const refreshToken = jwt.sign(
        { username: user.username },
        process.env.SECRET_KEY_REFRESH as string,
        { expiresIn: "7d" }
      );

      const cookieOptions: express.CookieOptions = {
        httpOnly: true,
        sameSite: "strict",
        secure: config.get("secure_session_cookie"),
      };

      // Send cookies for the tokens
      res.cookie("token", accessToken, cookieOptions);
      res.cookie("refreshToken", refreshToken, cookieOptions);

      // Set the user in the session
      req.session.user = { username };

      // Send success response
      return res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error(error); // Change this to your logger if needed
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
