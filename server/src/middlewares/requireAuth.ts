import { NextFunction, Response, Request } from "express";
import { AuthenticatedRequest } from "../types/express";
import { auth } from "../lib/auth";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET!;

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing token" });
    return;
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as any;
    (req as any).userId = decoded.userId;
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
    return;
  }
};
