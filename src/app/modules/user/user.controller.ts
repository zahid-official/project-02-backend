import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import UserService from "./user.service";

// Get user
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const limit = Number(req?.query?.limit) || 10;
  const page = Number(req?.query?.page) || 1;
  const result = await UserService.getAllUsers(limit, page);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// User controller object
const UserController = {
  getAllUsers,
};

export default UserController;
