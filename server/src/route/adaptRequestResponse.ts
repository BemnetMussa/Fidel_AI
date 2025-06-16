import type { Request, Response, NextFunction } from "express";

export function adaptApiHandler(apiHandler: Function) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const method = req.method;
      const url = req.originalUrl;
      const headers = req.headers;
      const body = req.body;

      const result = await apiHandler({
        method,
        url,
        headers,
        body,
      });

      res
        .status(result.status || 200)
        .set(result.headers || {})
        .send(result.body);
    } catch (err) {
      next(err);
    }
  };
}
