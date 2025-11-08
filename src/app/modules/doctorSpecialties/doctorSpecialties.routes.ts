import { Router } from "express";
import DoctorSpecialtiesController from "./doctorSpecialties.controller";

// Initialize router
const router = Router();

// Post routes
router.post("/create", DoctorSpecialtiesController.createDoctorSpecialties);

// Export doctor specialties routes
const DoctorSpecialtiesRoutes = router;
export default DoctorSpecialtiesRoutes;
