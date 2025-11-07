import { Router } from "express";
import ScheduleController from "./schedule.controller";
import validateToken from "../../middlewares/validateToken";

// Initialize router
const router = Router();

// Post routes
router.post("/create", ScheduleController.createSchedule);

// Export schedule routes
const ScheduleRoutes = router;
export default ScheduleRoutes;
