import { UserRole } from "@prisma/client";
import { Router } from "express";
import validateToken from "../../middlewares/validateToken";
import DoctorScheduleController from "./doctorSchedule.controller";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import { createDoctorScheduleZodSchema } from "./doctorSchedule.validation";

// Initialize router
const router = Router();

// Get routes
router.get(
  "/",
  validateToken(UserRole.DOCTOR, UserRole.PATIENT),
  DoctorScheduleController.getAllDoctorSchedules
);

// Post routes
router.post(
  "/create",
  validateToken(UserRole.DOCTOR),
  validateZodSchema(createDoctorScheduleZodSchema),
  DoctorScheduleController.createDoctorSchedule
);

// Export doctorSchedule routes
const DoctorScheduleRoutes = router;
export default DoctorScheduleRoutes;
