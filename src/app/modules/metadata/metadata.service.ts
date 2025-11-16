import { UserRole } from "@prisma/client";
import prisma from "../../config/prisma";
import AppError from "../../error/AppError";
import httpstatus from "http-status";

// Get metadata
const getMetadata = async (userRole: string) => {
  let metadata;
  switch (userRole) {
    case UserRole.ADMIN:
      metadata = await adminMetadata();
      break;

    case UserRole.DOCTOR:
      metadata = await doctorMetadata();
      break;
    case UserRole.PATIENT:
      metadata = await patientMetadata();
      break;
    default:
      throw new AppError(httpstatus.FORBIDDEN, "Invalid user role");
  }

  return metadata;
};

// Admin metadata
const adminMetadata = async () => {
  const adminsCount = await prisma.admin.count();
  const doctorsCount = await prisma.doctor.count();
  const patientsCount = await prisma.patient.count();
  const appointmentsCount = await prisma.appointment.count();
  const paymentsCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
  });

  // Construct metadata object
  const metadata = {
    adminsCount,
    doctorsCount,
    patientsCount,
    appointmentsCount,
    paymentsCount,
    totalRevenue: totalRevenue._sum.amount || 0,
  };

  return { message: "Admin metadata retrieved successfully", metadata };
};

// Doctor metadata
const doctorMetadata = async () => {};

// Patient metadata
const patientMetadata = async () => {};

// Metadata service object
const MetadataService = {
  getMetadata,
};

export default MetadataService;
