import { UserRole } from "@prisma/client";
import { Router } from "express";
import validateToken from "../../middlewares/validateToken";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import { createDoctorSpecialtiesZodSchema } from "./doctorSpecialties.validation";
import DoctorSpecialtiesController from "./doctorSpecialties.controller";

// Initialize router
const router = Router();

router.post(
  "/create",
  validateToken(UserRole.ADMIN),
  validateZodSchema(createDoctorSpecialtiesZodSchema),
  DoctorSpecialtiesController.createDoctorSpecialties
);

// Export doctor specialties routes
const DoctorSpecialtiesRoutes = router;
export default DoctorSpecialtiesRoutes;
