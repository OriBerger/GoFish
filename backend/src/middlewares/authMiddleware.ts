// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = "your_jwt_secret"; // Change this to your actual secret

interface RequestWithUser extends Request {
  user?: { userId: string };
}

const authenticate = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticate;
