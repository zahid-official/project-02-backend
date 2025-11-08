import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import SpecialtiesService from "./specialties.service";
import { cloudinaryUpload } from "../../config/cloudinary";

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
  createSpecialties,
};

export default SpecialtiesController;
