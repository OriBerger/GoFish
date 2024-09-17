import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || 'secretkey';

interface RequestWithUser extends Request {
  user?: { userId: string; userEmail: string };
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
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; email: string };
    req.user = { userId: decoded.userId, userEmail: decoded.email };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticate;
