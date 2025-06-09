import { Request, Response, NextFunction } from "express";
import { tokenService } from "../utils/jwt";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token: string | undefined = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ success: false, message: "Token required" });
    return;
  }

  try {
    const payload = tokenService.verifyToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
