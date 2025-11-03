import { Router } from "express";
import UserRoutes from "../modules/user/user.routes";

// Initialize main router
const router = Router();

// List of route configs
const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
];

// Register all routes
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// Export main router
const ModuleRouter = router;
export default ModuleRouter;
