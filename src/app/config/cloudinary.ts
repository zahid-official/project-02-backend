import { v2 as cloudinary } from "cloudinary";
import config from ".";

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
      console.log(error);
    });

  return uploadResult?.secure_url;
};
