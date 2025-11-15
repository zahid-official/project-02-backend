import { Router } from "express";
import PrescriptionController from "./prescription.controller";
import validateToken from "../../middlewares/validateToken";
import { UserRole } from "@prisma/client";

// Initialize router
const router = Router();

// Post routes
router.post(
  "/create",
  validateToken(UserRole.DOCTOR),
  PrescriptionController.createPrescription
);

// Export prescription routes
const PrescriptionRoutes = router;
export default PrescriptionRoutes;
