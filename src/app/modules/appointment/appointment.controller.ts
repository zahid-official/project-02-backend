import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppointmentService from "./appointment.service";

// Create appointment
const createAppointment = catchAsync(async (req: Request, res: Response) => {
  const body = req?.body;
  const userEmail = req?.decodedToken?.email;
  const result = await AppointmentService.createAppointment(userEmail, body);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Appointment created successfully",
    data: result,
  });
});

// Appointment controller object
const AppointmentController = {
  createAppointment,
};

export default AppointmentController;
