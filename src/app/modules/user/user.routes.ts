import { Router } from "express";
import UserController from "./user.controller";

// Initialize router
const router = Router();

// Get routes
router.get("/", UserController.getAllUsers);

// Export user routes
const UserRoutes = router;
export default UserRoutes;
