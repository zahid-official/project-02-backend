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
  validateToken(UserRole.ADMIN, UserRole.DOCTOR),
  DoctorController.getAllDoctors
);
router.get(
  "/singleDoctor/:id",
  validateToken(UserRole.ADMIN, UserRole.DOCTOR),
  DoctorController.getSingleDoctor
);

// Post routes
router.post(
  "/create",
  validateToken(UserRole.ADMIN),
  multerUploader.single("file"),
  validateZodSchema(createDoctorZodSchema),
  DoctorController.createDoctor
);
router.post("/ai-suggestion", DoctorController.doctorAiSuggestion);

// Patch routes
router.patch("/:id", DoctorController.updateDoctor);

// Export user routes
const DoctorRoutes = router;
export default DoctorRoutes;
