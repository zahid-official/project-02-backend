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

// User controller object
const UserController = {
  getAllUsers,
};

export default UserController;
