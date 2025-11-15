import { Router } from "express";
import AppointmentController from "./appointment.controller";
import validateToken from "../../middlewares/validateToken";
import { UserRole } from "@prisma/client";

// Initialize router
const router = Router();

// Get routes
router.get(
  "/my-appointments",
  validateToken(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentController.getMyAppointments
);

// Post routes
router.post(
  "/create",
  validateToken(UserRole.PATIENT),
  AppointmentController.createAppointment
);

// Patch routes
router.patch(
  "/:appointmentId",
  validateToken(UserRole.DOCTOR),
  AppointmentController.updateAppointment
);

// Export appointment routes
const AppointmentRoutes = router;
export default AppointmentRoutes;
