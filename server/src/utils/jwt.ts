import jwt from "jsonwebtoken";
import config from "config";

export function signJwt(
  object: Object,
  keyName: "accessTokenPrivateKey" | "resetTokenPrivateKey",
  options?: jwt.SignOptions | undefined
) {
  const signInKey = config.get("keyName");

  return jwt.sign(object, signInKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt() {}
