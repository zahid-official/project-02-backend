import { Router } from "express";
import multerUploader from "../../config/multer";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import PatientController from "./patient.controller";
import { createPatientZodSchema } from "./patient.validation";
import validateToken from "../../middlewares/validateToken";
import { UserRole } from "@prisma/client";

// Initialize router
const router = Router();

// Post routes
router.post(
  "/create",
  multerUploader.single("file"),
  validateZodSchema(createPatientZodSchema),
  PatientController.createPatient
);

// Patch routes
router.patch(
  "/update",
  validateToken(UserRole.PATIENT),
  PatientController.updatePatient
);

// Export patient routes
const PatientRoutes = router;
export default PatientRoutes;
