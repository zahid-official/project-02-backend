import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import UserService from "./user.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";

// Create patient
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createPatient(req?.body);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Patient created successfully",
    data: result,
  });
});

// User controller object
const UserController = {
  createPatient,
};

export default UserController;
