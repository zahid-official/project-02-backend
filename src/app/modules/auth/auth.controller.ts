import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AuthService from "./auth.service";
import { setCookies } from "../../utils/cookies";
import defaultAdmin from "../../utils/defaultAdmin";

// Login
const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req?.body);

  // Set tokens in cookie
  setCookies(res, result?.tokens);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Logged in successfully",
    data: result?.data,
  });
});

// Create default admin
const createDefaultAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await defaultAdmin();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Default admin created successfully",
    data: result,
  });
});

// Auth controller object
const AuthController = {
  login,
  createDefaultAdmin,
};

export default AuthController;
