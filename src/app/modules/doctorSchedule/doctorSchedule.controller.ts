import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import DoctorScheduleService from "./doctorSchedule.service";

// Get doctor schedules
const getAllDoctorSchedules = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DoctorScheduleService.getAllDoctorSchedules();
    // Send response
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All doctor schedules retrieved successfully",
      data: result,
    });
  }
);

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
  getAllDoctorSchedules,
  createDoctorSchedule,
};

export default DoctorScheduleController;
