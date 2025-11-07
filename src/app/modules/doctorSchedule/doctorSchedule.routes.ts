import { UserRole } from "@prisma/client";
import { Router } from "express";
import validateToken from "../../middlewares/validateToken";
import DoctorScheduleController from "./doctorSchedule.controller";

// Initialize router
const router = Router();

// Post routes
router.post(
  "/create",
  validateToken(UserRole.DOCTOR),
  DoctorScheduleController.createDoctorSchedule
);

// Export doctorSchedule routes
const DoctorScheduleRoutes = router;
export default DoctorScheduleRoutes;
