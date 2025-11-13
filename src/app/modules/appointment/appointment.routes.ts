import { Router } from "express";
import AppointmentController from "./appointment.controller";

// Initialize router
const router = Router();

// Post routes
router.post("/create", AppointmentController.createAppointment);

// Export appointment routes
const AppointmentRoutes = router;
export default AppointmentRoutes;
