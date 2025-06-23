import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import * as cookie from "cookie";

interface AuthenticatedRequest extends Request {
  user?: any;
  session?: any;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // it can't handle the row req.headers directly, so we need to convert it to a Headers object
    // Convert req.headers (IncomingHttpHeaders) to a Headers object
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        headers.set(key, value.join(","));
      } else if (value !== undefined) {
        headers.set(key, value);
      }
    }

    const sessionData = await auth.api.getSession({
      headers, // pass the Headers object
    });


    // console.log(" Full sessionData from getSession():", sessionData);

    if (!sessionData?.session || !sessionData?.user) {
      res.status(401).json({ error: "Invalid or expired session" });
      return;
    }
    req.user = sessionData.user;
    req.session = sessionData.session;
    

    next();
  } catch (error) {
    console.error("Session validation error:", error);
    res.status(403).json({ error: "Invalid token or session error" });
    return;
  }
};

