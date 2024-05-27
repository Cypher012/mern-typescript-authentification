/* // import crypto from "crypto-js";
import crypto from "crypto"

export function generateCode() {
  const length = 30;
  const randomBytes = crypto.randomBytes(Math.floor(Math.random()*50));
  const arr = randomBytes.toString().split("");

  const numericCode = arr.filter((arr) => !isNaN(parseInt(arr))).join("");

  return numericCode.slice(0, 6);
}
 */

import crypto from "crypto";

export function generateCode(): string {
  const length = 6;
  const max = Math.pow(10, length);
  const code = crypto.randomInt(0, max).toString().padStart(length, "0");
  return code;
}

export function generateKey() {
  const length = Math.floor(Math.random() * 50) + 450;
  const accessTokenPrivateKey = crypto
    .randomBytes(length)
    .toString("base64url");
  const accessTokenPublicKey = crypto.randomBytes(length).toString("base64url");
  const refreshPrivateKey = crypto.randomBytes(length).toString("base64url");
  const refreshPublicKey = crypto.randomBytes(length).toString("base64url");

  const key = `
  ACCESS_TOKEN_PUBLIC_KEY="${accessTokenPrivateKey}"
  ACCESS_TOKEN_PRIVATE_KEY="${accessTokenPublicKey}"
  REFRESH_PRIVATE_KEY="${refreshPrivateKey}"
  REFRESH_PUBLIC_KEY="${refreshPublicKey}"
  `;

  return key;
}
