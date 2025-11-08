import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import pickFields from "../../utils/pickFields";
import sendResponse from "../../utils/sendResponse";
import ScheduleService from "./schedule.service";

// Get all schedules
const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
  // Pagination & Sorting Parameters
  const paginationQueryKeys = ["limit", "page", "sortBy", "sortOrder"];
  const paginationOptions = pickFields(req?.query, paginationQueryKeys);

  // Search & Filtering Parameters
  const filterQueryKeys = ["startDateTime", "endDateTime"];
  const filterOptions = pickFields(req?.query, filterQueryKeys);

  // User email
  const userEmail = req?.decodedToken?.email;

  const result = await ScheduleService.getAllSchedules(
    paginationOptions,
    filterOptions,
    userEmail
  );

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All schedules retrieved successfully",
    data: result?.data,
    meta: result?.meta,
  });
});

// Create schedule
const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const body = req?.body;
  const result = await ScheduleService.createSchedule(body);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Schedule created successfully",
    data: result,
  });
});

// Delete schedule
const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const scheduleId = req?.params?.id;
  const result = await ScheduleService.deleteSchedule(scheduleId);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Schedule deleted successfully",
    data: result,
  });
});

// Schedule controller object
const ScheduleController = {
  getAllSchedules,
  createSchedule,
  deleteSchedule,
};

export default ScheduleController;
