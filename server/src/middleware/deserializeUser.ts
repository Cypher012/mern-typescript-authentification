import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  // console.log(`accessToken: ${accessToken}`);

  if (!accessToken) {
    return next();
  }

  const decoded = verifyJwt(accessToken, "accessTokenKey");

  if (!decoded) {
    return res.sendStatus(403);
  }

  req.user = decoded; // Set the user in the request object
  next(); // Proceed to the next middleware or route handler
};
