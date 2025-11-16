import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import PrescriptionService from "./prescription.service";
import pickFields from "../../utils/pickFields";

// Get all prescriptions
const getAllPrescriptions = catchAsync(async (req: Request, res: Response) => {
  const userEmail = req?.decodedToken?.email;

  // Pagination & Sorting Parameters
  const paginationQueryKeys = ["limit", "page", "sortBy", "sortOrder"];
  const paginationOptions = pickFields(req?.query, paginationQueryKeys);

  const result = await PrescriptionService.getAllPrescriptions(
    userEmail,
    paginationOptions
  );
  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Prescriptions retrieved successfully",
    data: result?.data,
    meta: result?.meta,
  });
});

// Create prescription
const createPrescription = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const userEmail = req?.decodedToken?.email;
  const result = await PrescriptionService.createPrescription(userEmail, body);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Prescription created successfully",
    data: result,
  });
});

// Prescription controller object
const PrescriptionController = {
  getAllPrescriptions,
  createPrescription,
};

export default PrescriptionController;
