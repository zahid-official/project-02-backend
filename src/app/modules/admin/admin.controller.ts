import { Request, Response } from "express";
import httpStatus from "http-status";
import { cloudinaryUpload } from "../../config/cloudinary";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AdminService from "./admin.service";

// Create admin
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.admin.profilePhoto = await cloudinaryUpload(req.file);
  }
  const password = req?.body?.password;
  const body = req?.body?.admin;
  const result = await AdminService.createAdmin(body, password);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Admin created successfully",
    data: result,
  });
});

// Admin controller object
const AdminController = {
  createAdmin,
};

export default AdminController;
