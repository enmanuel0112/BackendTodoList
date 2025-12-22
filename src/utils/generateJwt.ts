import jwt, { Secret } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { randomUUID } from "crypto";

export const signAccessToke = (payload: object): String => {
  return jwt.sign(
    payload,
    jwtConfig.accessSecret as Secret,
    {
      expiresIn: jwtConfig.accessTttl,
      jwtid: randomUUID(),
      algorithm: "HS256",
    } as jwt.SignOptions
  );
};

export const signRefreshToken = (payload: object): string => {
  return jwt.sign(
    payload,
    jwtConfig.refreshSecret,

    {
      expiresIn: jwtConfig.refreshTttl,
      jwtid: randomUUID(),
      algorithm: "HS256",
    } as jwt.SignOptions & { secret: Secret }
  );
};
