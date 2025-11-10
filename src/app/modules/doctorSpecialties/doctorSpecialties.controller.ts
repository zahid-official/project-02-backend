import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import DoctorSpecialtiesService from "./doctorSpecialties.service";

// Get doctor specialties
const getDoctorSpeialties = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorSpecialtiesService.getDoctorSpeialties();

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Doctor specialties retrieved successfully",
    data: result,
  });
});

// Create doctor specialties
const createDoctorSpecialties = catchAsync(
  async (req: Request, res: Response) => {
    const body = req?.body;
    const result = await DoctorSpecialtiesService.createDoctorSpecialties(body);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Doctor specialties created successfully",
      data: result,
    });
  }
);

// User controller object
const DoctorSpecialtiesController = {
  getDoctorSpeialties,
  createDoctorSpecialties,
};

export default DoctorSpecialtiesController;
