import { DocumentType } from "@typegoose/typegoose";
import { User, privateFields } from "../model/user.model";
import { signJwt } from "../utils/jwt";
import sessionModel from "../model/session.model";
import { omit } from "lodash";

export async function createSession({ userId }: { userId: string }) {
  return sessionModel.create({ user: userId });
}

export async function signRefreshToken({ userId }: { userId: string }) {
  const session = await createSession({
    userId,
  });

  const refreshToken = signJwt({ session: session._id }, "refreshTokenKey", {
    expiresIn: "7d",
  });

  return refreshToken;
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = omit(user.toJSON(), privateFields);

  const accessToken = signJwt(payload, "accessTokenKey", {
    expiresIn: "15m",
  });

  return accessToken;
}
