import { Router } from "express";
import PatientRoutes from "../modules/patient/patient.routes";
import AuthRoutes from "../modules/auth/auth.routes";
import AdminRoutes from "../modules/admin/admin.routes";
import DoctorRoutes from "../modules/doctor/doctor.routes";

// Initialize main router
const router = Router();

// List of route configs
const moduleRoutes = [
  {
    path: "/patient",
    route: PatientRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/doctor",
    route: DoctorRoutes,
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
