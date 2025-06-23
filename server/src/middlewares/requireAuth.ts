import { NextFunction, Response, Request } from "express";
import { AuthenticatedRequest } from "../types/express";
import { auth } from "../lib/auth";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const headers = new Headers();

    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        // Headers require string or string[]
        if (Array.isArray(value)) {
          headers.set(key, value.join(","));
        } else {
          headers.set(key, value);
        }
      }
    }

    const session = await auth.api.getSession({
      headers,
      query: { disableCookieCache: true },
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
