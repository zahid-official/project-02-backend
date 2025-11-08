import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import DoctorSpecialtiesService from "./doctorSpecialties.service";

// Create doctorSpecialties
const createDoctorSpecialties = catchAsync(
  async (req: Request, res: Response) => {
    const body = req?.body;
    const result = await DoctorSpecialtiesService.createDoctorSpecialties(body);

    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Doctor specialties created successfully",
      data: result,
    });
  }
);

// User controller object
const DoctorSpecialtiesController = {
  createDoctorSpecialties,
};

export default DoctorSpecialtiesController;
