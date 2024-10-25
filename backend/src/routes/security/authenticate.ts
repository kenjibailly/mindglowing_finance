import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

// Define the type for the user payload
interface UserPayload {
  username: string; // Adjust based on your actual user payload structure
  // Add any other properties that are included in the token
}

// Extend the Request interface to include a user property
export interface RequestWithUser extends Request {
  user?: UserPayload; // Define user as optional
}

// Middleware function to authenticate tokens
export function authenticateToken(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies.token; // Assuming token is in cookies

  if (!token) {
    // Send response and terminate function
    res.status(401).json({ message: "Unauthorized, please log in" });
    return; // Ensure we return here to prevent any further execution
  }

  // Correctly typed verify function
  jwt.verify(
    token,
    process.env.SECRET_KEY as string,
    (err: VerifyErrors | null, decoded: unknown) => {
      if (err) {
        // Send response and terminate function
        res
          .status(403)
          .json({ message: "Invalid or expired token, please log in" });
        return; // Ensure we return here to prevent any further execution
      }

      // Cast decoded to the correct type
      const user = decoded as UserPayload; // Cast to your UserPayload type
      req.user = user; // Assign user to req.user

      next(); // Proceed to the next middleware
    }
  );
}
