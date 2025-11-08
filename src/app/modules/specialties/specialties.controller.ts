import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import SpecialtiesService from "./specialties.service";

// Create specialties
const createSpecialties = catchAsync(async (req: Request, res: Response) => {
  const body = req?.body;
  const result = await SpecialtiesService.createSpecialties(body);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Specialties created successfully",
    data: result,
  });
});

// Specialties controller object
const SpecialtiesController = {
  createSpecialties,
};

export default SpecialtiesController;
