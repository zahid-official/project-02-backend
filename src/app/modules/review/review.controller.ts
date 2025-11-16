import { Request, Response } from "express";
import httpStatus from "http-status";
import { cloudinaryUpload } from "../../config/cloudinary";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import ReviewService from "./review.service";

// Create review
const createReview = catchAsync(async (req: Request, res: Response) => {
  const body = req?.body;
  const userEmail = req?.decodedToken?.email;
  const result = await ReviewService.createReview(userEmail, body);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

// Review controller object
const ReviewController = {
  createReview,
};

export default ReviewController;
