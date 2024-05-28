import jwt from "jsonwebtoken";
import config from "config";
import { log } from "./logger";

export function signJwt(
  object: Object,
  keyName: "accessTokenKey" | "refreshTokenKey",
  options?: jwt.SignOptions | undefined
) {
  const token = jwt.sign(object, config.get<string>(keyName), {
    ...(options && options),
  });

  return token;
}

export function verifyJwt<T>(
  token: string,
  keyName: "accessTokenKey" | "refreshTokenKey"
): T | null {
  const tokenKey = config.get<string>(keyName);
  try {
    const decoded = jwt.verify(token, tokenKey) as T;
    return decoded;
  } catch (e) {
    return null;
  }
}
