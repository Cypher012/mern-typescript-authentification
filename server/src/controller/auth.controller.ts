import { Request, Response } from "express";
import { createSessionInput } from "../schema/auth.schema";
import { findUserByEmail } from "../service/user.service";
import { signAccessToken, signRefreshToken } from "../service/auth.service";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt";

export const createSessionHandler = async (
  req: Request<{}, {}, createSessionInput>,
  res: Response
) => {
  const message = "Invalid email or password";
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.send(message);
  }

  if (!user.verified) {
    return res.send("Please verify your email");
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.send(message);
  }

  //sign a access token

  const accessToken = signAccessToken(user);

  //sign a refresh token
  const refreshToken = await signRefreshToken({ userId: user.id });
  //send the token

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.send("Login Successfully");
};

export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response
) => {
  const refreshToken = get(req, "headers.x-refresh");
};
