import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import PrescriptionService from "./prescription.service";

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
  createPrescription,
};

export default PrescriptionController;
