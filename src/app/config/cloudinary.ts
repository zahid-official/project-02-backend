import { v2 as cloudinary } from "cloudinary";
import config from ".";
import AppError from "../error/AppError";
import httpStatus from "http-status";

// Cloudinary upload
export const cloudinaryUpload = async (file: Express.Multer.File) => {
  // Configuration
  cloudinary.config({
    cloud_name: config.cloudinary.cloud,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(file.path, {
      public_id: file.filename,
    })
    .catch((error) => {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message || "Cloudinary upload failed"
      );
    });

  return uploadResult?.secure_url;
};
