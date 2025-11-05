import { Request, Response } from "express";
import httpStatus from "http-status";
import { cloudinaryUpload } from "../../config/cloudinary";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import DoctorService from "./doctor.service";

// Create doctor
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.doctor.profilePhoto = await cloudinaryUpload(req.file);
  }
  const password = req?.body?.password;
  const body = req?.body?.doctor;
  const result = await DoctorService.createDoctor(body, password);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Doctor created successfully",
    data: result,
  });
});

// Doctor controller object
const DoctorController = {
  createDoctor,
};

export default DoctorController;
