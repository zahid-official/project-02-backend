import { Router } from "express";
import multerUploader from "../../config/multer";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import { createDoctorZodSchema } from "./doctor.validation";
import DoctorController from "./doctor.controller";

// Initialize router
const router = Router();

// Post routes
router.post(
  "/create",
  multerUploader.single("file"),
  validateZodSchema(createDoctorZodSchema),
  DoctorController.createDoctor
);

// Export user routes
const DoctorRoutes = router;
export default DoctorRoutes;
