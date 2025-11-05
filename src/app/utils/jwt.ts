import { User } from "@prisma/client";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../config";

// Generate jwt access token
export const generateAccessToken = (user: Partial<User>) => {
  const payload = {
    id: user?.id,
    email: user?.email,
    role: user?.role,
  } as JwtPayload;
  const secret = config.jwt.access_secret as string;
  const expiresIn = config.jwt.access_expiresin;

  const accessToken = jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return accessToken;
};

// Generate jwt refresh token
export const generateRefreshToken = (user: Partial<User>) => {
  const payload = {
    id: user?.id,
    email: user?.email,
    role: user?.role,
  } as JwtPayload;
  const secret = config.jwt.refresh_secret as string;
  const expiresIn = config.jwt.refresh_expiresin;

  const refreshToken = jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return refreshToken;
};

// Verify jwt token
export const verifyJWT = (token: string, secret: string) => {
  const verifiedToken = jwt.verify(token, secret);
  return verifiedToken;
};
