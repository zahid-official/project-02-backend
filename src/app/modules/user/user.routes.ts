import { Router } from "express";
import UserController from "./user.controller";
import multerUploader from "../../config/multer";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import { createPatientZodSchema } from "./user.validation";

// Initialize router
const router = Router();

// Post routes
router.post(
  "/create-patient",
  multerUploader.single("file"),
  validateZodSchema(createPatientZodSchema),
  UserController.createPatient
);

// Export user routes
const UserRoutes = router;
export default UserRoutes;
