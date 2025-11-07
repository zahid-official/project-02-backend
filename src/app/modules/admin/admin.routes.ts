import { Router } from "express";
import multerUploader from "../../config/multer";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import { createAdminZodSchema } from "./admin.validation";
import AdminController from "./admin.controller";
import validateToken from "../../middlewares/validateToken";
import { UserRole } from "@prisma/client";

// Initialize router
const router = Router();

// Post routes
router.post(
  "/create",
  validateToken(UserRole.ADMIN),
  multerUploader.single("file"),
  validateZodSchema(createAdminZodSchema),
  AdminController.createAdmin
);

// Export user routes
const AdminRoutes = router;
export default AdminRoutes;
