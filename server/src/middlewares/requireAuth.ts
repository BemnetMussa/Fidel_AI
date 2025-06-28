import { NextFunction, Response, Request } from "express";
import { AuthenticatedRequest } from "../types/express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user?.id) {
      res.status(403).json({ error: "Unauthorized: No user ID" });
      return;
    }

    // Attach userId to request for downstream use
    (req as AuthenticatedRequest).user = {
      id: session.user.id,
      email: session.user.email,
    };

    next(); // Continue to the protected route
  } catch (err) {
    console.error("Auth error:", err);
    res.status(403).json({ error: "Unauthorized" });
    return;
  }
};
