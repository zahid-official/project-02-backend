import { UserRole } from "@prisma/client";
import { Router } from "express";
import validateToken from "../../middlewares/validateToken";
import MetadataController from "./metadata.controller";

// Initialize router
const router = Router();

// Get routes
router.get(
  "/",
  validateToken(...Object.values(UserRole)),
  MetadataController.getMetadata
);

// Export metadata routes
const MetadataRoutes = router;
export default MetadataRoutes;
