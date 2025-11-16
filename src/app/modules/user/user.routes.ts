import { Router } from "express";
import UserController from "./user.controller";
import validateToken from "../../middlewares/validateToken";
import { UserRole } from "@prisma/client";

// Initialize router
const router = Router();

// Get routes
router.get("/", validateToken(UserRole.ADMIN), UserController.getAllUsers);
router.get(
  "/me",
  validateToken(...Object.values(UserRole)),
  UserController.getMe
);

// Export user routes
const UserRoutes = router;
export default UserRoutes;
