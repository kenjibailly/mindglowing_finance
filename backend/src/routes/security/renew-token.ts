import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import config from "config";

const router: Router = express.Router();

// Endpoint for token renewal
router.post("/", async (req: Request, res: Response): Promise<any> => {
  // Extract the token from the request
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "Refresh token not provided" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH as string
    ) as { username: string };

    // Generate a new JWT access token
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.SECRET_KEY as string,
      { expiresIn: `${process.env.VITE_ACCESS_TOKEN_EXPIRY_IN_SECONDS}s` }
    );

    const cookieOptions: express.CookieOptions = {
      httpOnly: true,
      sameSite: "strict",
      secure: config.get("secure_session_cookie"),
    };

    // Creates the token cookie
    res.cookie("token", accessToken, cookieOptions);

    return res.json({ success: true, token: accessToken });
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid refresh token" });
  }
});

export default router;
