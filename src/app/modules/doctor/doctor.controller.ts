import { Request, Response } from "express";
import httpStatus from "http-status";
import { cloudinaryUpload } from "../../config/cloudinary";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import DoctorService from "./doctor.service";
import pickFields from "../../utils/pickFields";

// Get all doctors
const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  // Pagination & Sorting Parameters
  const paginationQueryKeys = ["limit", "page", "sortBy", "sortOrder"];
  const paginationOptions = pickFields(req?.query, paginationQueryKeys);

  // Search & Filtering Parameters
  const filterQueryKeys = ["searchTerm", "name", "email", "gender"];
  const filterOptions = pickFields(req?.query, filterQueryKeys);

  // console.log(req?.query, filterQueryKeys);
  const result = await DoctorService.getAllDoctors(
    paginationOptions,
    filterOptions
  );

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All doctors retrieved successfully",
    data: result?.data,
    meta: result?.meta,
  });
});

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
  getAllDoctors,
  createDoctor,
};

export default DoctorController;
