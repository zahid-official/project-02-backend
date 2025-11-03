import { Router } from "express";
import UserController from "./user.controller";

// Initialize router
const router = Router();

// Post routes
router.post("/create-patient", UserController.createPatient);

// Export user routes
const UserRoutes = router;
export default UserRoutes;
