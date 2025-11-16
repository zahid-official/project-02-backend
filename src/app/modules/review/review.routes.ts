import { UserRole } from "@prisma/client";
import { Router } from "express";
import validateToken from "../../middlewares/validateToken";
import ReviewController from "./review.controller";

// Initialize router
const router = Router();

// Post routes
router.post(
  "/create",
  validateToken(UserRole.PATIENT),
  ReviewController.createReview
);

// Export review routes
const ReviewRoutes = router;
export default ReviewRoutes;
