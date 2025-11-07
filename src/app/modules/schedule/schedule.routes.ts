import { Router } from "express";
import ScheduleController from "./schedule.controller";
import validateToken from "../../middlewares/validateToken";
import { UserRole } from "@prisma/client";

// Initialize router
const router = Router();

// Get routes
router.get("/", validateToken(UserRole.ADMIN, UserRole.DOCTOR), ScheduleController.getAllSchedules);

// Post routes
router.post(
  "/create",
  validateToken(UserRole.ADMIN),
  ScheduleController.createSchedule
);

// Export schedule routes
const ScheduleRoutes = router;
export default ScheduleRoutes;
