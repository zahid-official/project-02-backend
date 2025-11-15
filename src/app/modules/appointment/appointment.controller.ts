import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppointmentService from "./appointment.service";
import pickFields from "../../utils/pickFields";

// Get my appointments
const getMyAppointments = catchAsync(async (req: Request, res: Response) => {
  const UserRole = req?.decodedToken?.role;
  const userEmail = req?.decodedToken?.email;

  // Pagination & Sorting Parameters
  const paginationQueryKeys = ["limit", "page", "sortBy", "sortOrder"];
  const paginationOptions = pickFields(req?.query, paginationQueryKeys);

  // Search & Filtering Parameters
  const filterQueryKeys = ["paymentStatus", "appointmentStatus"];
  const filterOptions = pickFields(req?.query, filterQueryKeys);

  const result = await AppointmentService.getMyAppointments(
    UserRole,
    userEmail,
    paginationOptions,
    filterOptions
  );
  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Appointments retrieved successfully",
    data: result,
  });
});

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
  getMyAppointments,
  createAppointment,
};

export default AppointmentController;
