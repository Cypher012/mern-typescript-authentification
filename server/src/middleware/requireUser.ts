import { NextFunction, Request, Response } from "express";

export const requireUser = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) {
    return res.status(403);
  }
  return next();
};
