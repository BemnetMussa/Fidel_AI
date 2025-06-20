import { NextFunction, Response, Request } from "express";
import { AuthenticatedRequest } from "../types/express";
import { getSession } from "better-auth";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const session = await getSession(token);

    if (!session || !session.user || !session.user.id) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    // Attach user to req by casting to AuthenticatedRequest
    (req as AuthenticatedRequest).user = {
      id: session.user.id,
      email: session.user.email,
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Unauthorized request" });
    return;
  }
};
