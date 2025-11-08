import { Router } from "express";
import ScheduleController from "./schedule.controller";
import validateToken from "../../middlewares/validateToken";
import { UserRole } from "@prisma/client";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import { createScheduleZodSchema } from "./schedule.validation";

// Initialize router
const router = Router();

// Get routes
router.get(
  "/",
  validateToken(UserRole.ADMIN, UserRole.DOCTOR),
  ScheduleController.getAllSchedules
);

// Post routes
router.post(
  "/create",
  validateToken(UserRole.ADMIN),
  validateZodSchema(createScheduleZodSchema),
  ScheduleController.createSchedule
);

// Delete routes
router.delete(
  "/delete/:id",
  validateToken(UserRole.ADMIN),
  ScheduleController.deleteSchedule
);

// Export schedule routes
const ScheduleRoutes = router;
export default ScheduleRoutes;
