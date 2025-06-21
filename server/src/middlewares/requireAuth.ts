import { NextFunction, Response, Request } from "express";
import { AuthenticatedRequest } from "../types/express";
import { auth } from "../lib/auth";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Convert req.headers to Headers for Better Auth
    const headers = new Headers();
    console.log("Headers received:", req.headers);
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else {
          headers.append(key, value);
        }
      }
    }

    const session = await auth.api.getSession({
      query: {
        disableCookieCache: true,
      },
      headers,
    });

    if (!session || !session.user || !session.user.id) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    console.log("Session retrieved:", session);
    // Attach user
    (req as AuthenticatedRequest).user = {
      id: session.user.id,
      email: session.user.email,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

