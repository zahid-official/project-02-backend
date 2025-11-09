import { Router } from "express";
import multerUploader from "../../config/multer";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import { createDoctorZodSchema } from "./doctor.validation";
import DoctorController from "./doctor.controller";
import validateToken from "../../middlewares/validateToken";
import { UserRole } from "@prisma/client";

// Initialize router
const router = Router();

// Get routes
router.get(
  "/",
  validateToken(...Object.values(UserRole)),
  DoctorController.getAllDoctors
);

// Post routes
router.post(
  "/create",
  validateToken(UserRole.ADMIN),
  multerUploader.single("file"),
  validateZodSchema(createDoctorZodSchema),
  DoctorController.createDoctor
);

// Export user routes
const DoctorRoutes = router;
export default DoctorRoutes;
