import { Router } from "express";
import AppointmentController from "./appointment.controller";
import validateToken from "../../middlewares/validateToken";
import { UserRole } from "@prisma/client";

// Initialize router
const router = Router();

// Post routes
router.post(
  "/create",
  validateToken(UserRole.PATIENT),
  AppointmentController.createAppointment
);

// Export appointment routes
const AppointmentRoutes = router;
export default AppointmentRoutes;
