import { Router } from "express";
import AuthController from "./auth.controller";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import { loginZodSchema } from "./auth.validation";

// Initialize router
const router = Router();

// Post routes
router.post("/login", validateZodSchema(loginZodSchema), AuthController.login);

// Export auth routes
const AuthRoutes = router;
export default AuthRoutes;
