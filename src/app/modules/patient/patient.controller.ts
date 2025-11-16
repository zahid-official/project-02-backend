import { Request, Response } from "express";
import httpStatus from "http-status";
import { cloudinaryUpload } from "../../config/cloudinary";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import PatientService from "./patient.service";

// Create patient
const createPatient = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.patient.profilePhoto = await cloudinaryUpload(req.file);
  }
  const password = req?.body?.password;
  const body = req?.body?.patient;
  const result = await PatientService.createPatient(body, password);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Patient created successfully",
    data: result,
  });
});

// Update patient
const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const userEmail = req?.decodedToken?.email;
  const body = req?.body;
  const result = await PatientService.updatePatient(userEmail, body);
  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Patient updated successfully",
    data: result,
  });
});

// Patient controller object
const PatientController = {
  createPatient,
  updatePatient,
};

export default PatientController;
