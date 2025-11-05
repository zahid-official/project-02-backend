import { UserStatus } from "@prisma/client";
import prisma from "../../config/prisma";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

// Login
const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload?.email,
      status: UserStatus.ACTIVE,
    },
  });

  // Verify password
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    user?.password
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password!");
  }

  // Generate jwt tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const tokens = { accessToken, refreshToken };

  // Remove password field
  const { password, ...data } = user;
  return { data, tokens };
};

// Auth service object
const AuthService = {
  login,
};

export default AuthService;
