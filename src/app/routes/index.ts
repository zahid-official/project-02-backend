import { Router } from "express";
import PatientRoutes from "../modules/patient/patient.routes";
import AuthRoutes from "../modules/auth/auth.routes";
import AdminRoutes from "../modules/admin/admin.routes";
import DoctorRoutes from "../modules/doctor/doctor.routes";
import UserRoutes from "../modules/user/user.routes";

// Initialize main router
const router = Router();

// List of route configs
const moduleRoutes = [
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/patient",
    route: PatientRoutes,
  },
  {
    path: "/doctor",
    route: DoctorRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

// Register all routes
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// Export main router
const ModuleRouter = router;
export default ModuleRouter;
