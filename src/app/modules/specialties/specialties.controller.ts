import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import SpecialtiesService from "./specialties.service";
import { cloudinaryUpload } from "../../config/cloudinary";

// Get specialties
const getSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.getSpeialties();

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specialties retrieved successfully",
    data: result,
  });
});

// Create specialties
const createSpecialties = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.icon = await cloudinaryUpload(req.file);
  }
  const body = req?.body;
  const result = await SpecialtiesService.createSpecialties(body);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specialties created successfully",
    data: result,
  });
});

// User controller object
const SpecialtiesController = {
  getSpecialties,
  createSpecialties,
};

export default SpecialtiesController;
