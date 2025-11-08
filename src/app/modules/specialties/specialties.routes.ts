import { Router } from "express";
import multerUploader from "../../config/multer";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import SpecialtiesController from "./specialties.controller";
import { createSpecialtiesZodSchema } from "./specialties.validation";
import validateToken from "../../middlewares/validateToken";
import { UserRole } from "@prisma/client";

// Initialize router
const router = Router();

router.post(
  "/create",
  validateToken(UserRole.ADMIN),
  multerUploader.single("file"),
  validateZodSchema(createSpecialtiesZodSchema),
  SpecialtiesController.createSpecialties
);

// Export user routes
const SpecialtiesRoutes = router;
export default SpecialtiesRoutes;
