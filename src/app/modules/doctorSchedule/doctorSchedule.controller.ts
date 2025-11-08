import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import DoctorScheduleService from "./doctorSchedule.service";

// Create doctor schedule
const createDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
  const body = req?.body;
  const doctorEmail = req?.decodedToken?.email;

  const result = await DoctorScheduleService.createDoctorSchedule(
    doctorEmail,
    body
  );

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Doctor schedule created successfully",
    data: result,
  });
});

// Doctor schedule controller object
const DoctorScheduleController = {
  createDoctorSchedule,
};

export default DoctorScheduleController;
