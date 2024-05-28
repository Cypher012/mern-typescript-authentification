import { Request, Response } from "express";
import { createSessionInput } from "../schema/auth.schema";
import { findUserByEmail, findUserById } from "../service/user.service";
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from "../service/auth.service";
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
  try {
    // Extract the refresh token from cookies or headers
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    // Verify the refresh token
    const decoded = verifyJwt<{ session: string }>(
      refreshToken,
      "refreshTokenKey"
    );
    if (!decoded) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Check if the session is valid
    const session = await findSessionById(decoded.session);
    if (!session || !session.valid) {
      return res.status(403).json({ message: "Invalid session" });
    }

    // Find the user associated with the session
    const user = await findUserById(String(session.user));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new access token
    const accessToken = signAccessToken(user);

    // Send the new access token back to the client
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // Use secure cookies in production
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
