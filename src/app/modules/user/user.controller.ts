import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import UserService from "./user.service";
import pickFields from "../../utils/pickFields";

// Get user
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  // Pagination & Sorting Parameters
  const paginationQueryKeys = ["limit", "page", "sortBy", "sortOrder"];
  const paginationOptions = pickFields(req?.query, paginationQueryKeys);

  // Search & Filtering Parameters
  const filterQueryKeys = ["searchTerm", "status", "role"];
  const filterOptions = pickFields(req?.query, filterQueryKeys);

  const result = await UserService.getAllUsers(
    paginationOptions,
    filterOptions
  );

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All users retrieved successfully",
    data: result?.data,
    meta: result?.meta,
  });
});

// Get logged-in user
const getMe = catchAsync(async (req: Request, res: Response) => {
  const userEmail = req.decodedToken?.email;
  const userRole = req.decodedToken?.role;
  const result = await UserService.getMe(userEmail, userRole);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

// User controller object
const UserController = {
  getAllUsers,
  getMe,
};

export default UserController;
