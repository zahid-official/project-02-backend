import { Router } from "express";
import SpecialtiesController from "./specialties.controller";

// Initialize router
const router = Router();

// Post routes
router.post("/create", SpecialtiesController.createSpecialties);

// Export specialties routes
const SpecialtiesRoutes = router;
export default SpecialtiesRoutes;
