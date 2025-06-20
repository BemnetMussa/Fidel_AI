import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
    // Add any other user properties you need
  };
}
