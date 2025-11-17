import { Request, Response } from "express";
import httpStatus from "http-status";
import { cloudinaryUpload } from "../../config/cloudinary";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import MetadataService from "./metadata.service";

// Get metadata
const getMetadata = catchAsync(async (req: Request, res: Response) => {
  const userEmail = req.decodedToken?.email;
  const userRole = req.decodedToken?.role;
  const result = await MetadataService.getMetadata(userEmail, userRole);

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result?.message as string,
    data: result?.metadata,
  });
});

// Metadata controller object
const MetadataController = {
  getMetadata,
};

export default MetadataController;
