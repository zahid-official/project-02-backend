import { Router } from "express";
import multerUploader from "../../config/multer";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import PatientController from "./patient.controller";
import { createPatientZodSchema } from "./patient.validation";

// Initialize router
const router = Router();

// Post routes
router.post(
  "/create",
  multerUploader.single("file"),
  validateZodSchema(createPatientZodSchema),
  PatientController.createPatient
);

// Export patient routes
const PatientRoutes = router;
export default PatientRoutes;
