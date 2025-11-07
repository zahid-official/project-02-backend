import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../error/AppError";
import httpStatus from "http-status";
import { verifyJWT } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";

const validateToken = (...userRole: string[]) =>
  catchAsync(
    async (
      req: Request & { decodedToken?: any },
      res: Response,
      next: NextFunction
    ) => {
      const accessToken = req?.cookies?.accessToken;
      if (!accessToken) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "No access token provided, authorization denied"
        );
      }

      // Verify & decode access token
      const verifiedToken = verifyJWT(
        accessToken,
        config.jwt.access_secret as string
      ) as JwtPayload;

      // Check if user has permission to access
      if (!userRole.includes(verifiedToken.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You do not have permission to access this resource"
        );
      }

      // Attach the decoded token to the request object for further use
      req.decodedToken = verifiedToken;
      next();
    }
  );

export default validateToken;
