import { Router } from "express";
import PatientRoutes from "../modules/patient/patient.routes";
import AuthRoutes from "../modules/auth/auth.routes";
import AdminRoutes from "../modules/admin/admin.routes";
import DoctorRoutes from "../modules/doctor/doctor.routes";
import UserRoutes from "../modules/user/user.routes";
import ScheduleRoutes from "../modules/schedule/schedule.routes";
import DoctorScheduleRoutes from "../modules/doctorSchedule/doctorSchedule.routes";
import SpecialtiesRoutes from "../modules/specialties/specialties.routes";
import DoctorSpecialtiesRoutes from "../modules/doctorSpecialties/doctorSpecialties.routes";
import AppointmentRoutes from "../modules/appointment/appointment.routes";

// Initialize main router
const router = Router();

// List of route configs
const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
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
    path: "/patient",
    route: PatientRoutes,
  },
  {
    path: "/schedule",
    route: ScheduleRoutes,
  },
  {
    path: "/doctor-schedule",
    route: DoctorScheduleRoutes,
  },
  {
    path: "/specialties",
    route: SpecialtiesRoutes,
  },
  {
    path: "/doctor-specialties",
    route: DoctorSpecialtiesRoutes,
  },
  {
    path: "/appointment",
    route: AppointmentRoutes,
  },
];

// Register all routes
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// Export main router
const ModuleRouter = router;
export default ModuleRouter;
