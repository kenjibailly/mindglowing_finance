import express, { Request, Response } from "express";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  // Destroy the user session
  req.session.destroy((err: Error | null) => {
    if (err) {
      logger.error("Error destroying session:", err);
      return res
        .status(401)
        .json({ error: "Unable to log out, please try again." });
    } else {
      // Redirect to home after logging out
      logger.info("Logout successful");
      return res.status(200).json({ message: "Logout successful" });
    }
  });
});

export default router;
