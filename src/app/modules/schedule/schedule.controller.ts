import { Request, Response } from "express";
import httpStatus from "http-status";
import { cloudinaryUpload } from "../../config/cloudinary";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import ScheduleService from "./schedule.service";

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

// Schedule controller object
const ScheduleController = {
  createSchedule,
};

export default ScheduleController;
