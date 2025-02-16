import exp from "constants";
import { NextFunction, Request, Response } from "express";

export interface AuthRequest extends Request {
  userId?: string;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.cookies.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    req.userId = userId;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

export { authMiddleware };
