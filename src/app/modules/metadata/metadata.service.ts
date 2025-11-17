import { PaymentStatus, UserRole } from "@prisma/client";
import prisma from "../../config/prisma";
import AppError from "../../error/AppError";
import httpstatus from "http-status";

// Get metadata
const getMetadata = async (userEmail: string, userRole: string) => {
  let metadata;
  switch (userRole) {
    case UserRole.ADMIN:
      metadata = await adminMetadata();
      break;

    case UserRole.DOCTOR:
      metadata = await doctorMetadata(userEmail);
      break;
    case UserRole.PATIENT:
      metadata = await patientMetadata(userEmail);
      break;
    default:
      throw new AppError(httpstatus.FORBIDDEN, "Invalid user role");
  }

  return metadata;
};

// Bar chart data
const barChart = async () => {
  const result = await prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "createdAt") AS month,
        CAST(COUNT(*) AS INTEGER) AS count
        FROM "appointments"
        GROUP BY month
        ORDER BY month ASC;
    `;

  return result;
};

// Pie chart data
const pieChart = async () => {
  const appointmentChart = await prisma.appointment.groupBy({
    by: ["appointmentStatus"],
    _count: { appointmentStatus: true },
  });

  const result = appointmentChart.map(({ appointmentStatus, _count }) => ({
    appointmentStatus,
    count: _count.appointmentStatus,
  }));

  return result;
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

  const barChartData = await barChart();
  const pieChartData = await pieChart();

  // Construct metadata object
  const metadata = {
    adminsCount,
    doctorsCount,
    patientsCount,
    appointmentsCount,
    paymentsCount,
    totalRevenue: totalRevenue._sum.amount || 0,
    barChartData,
    pieChartData,
  };

  return { message: "Admin metadata retrieved successfully", metadata };
};

// Doctor metadata
const doctorMetadata = async (userEmail: string) => {
  // Patients count grouped by id
  const patientsCountData = await prisma.patient.groupBy({
    by: ["id"],
    _count: { id: true },
  });
  const patientsCount = patientsCountData?.map(({ id, _count }) => ({
    id,
    count: _count.id,
  }));

  // Appointment status count
  const appointmentStatusData = await prisma.appointment.groupBy({
    by: ["appointmentStatus"],
    where: { doctor: { email: userEmail } },
    _count: { appointmentStatus: true },
  });
  const appointmentStatus = appointmentStatusData?.map(
    ({ appointmentStatus, _count }) => ({
      appointmentStatus,
      count: _count.appointmentStatus,
    })
  );

  const appointmentsCount = await prisma.appointment.count({
    where: { doctor: { email: userEmail } },
  });

  // Review count
  const reviewCount = await prisma.review.count({
    where: { doctor: { email: userEmail } },
  });

  // Total revenue
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      appointment: {
        doctor: { email: userEmail },
        paymentStatus: PaymentStatus.PAID,
      },
    },
  });

  const metadata = {
    patientsCount,
    appointmentStatus,
    appointmentsCount,
    reviewCount,
    totalRevenue: totalRevenue._sum.amount || 0,
  };
  return { message: "Doctor metadata retrieved successfully", metadata };
};

// Patient metadata
const patientMetadata = async (userEmail: string) => {
  // Appointment status count
  const appointmentStatusData = await prisma.appointment.groupBy({
    by: ["appointmentStatus"],
    where: { patient: { email: userEmail } },
    _count: { appointmentStatus: true },
  });
  const appointmentStatus = appointmentStatusData?.map(
    ({ appointmentStatus, _count }) => ({
      appointmentStatus,
      count: _count.appointmentStatus,
    })
  );

  const appointmentsCount = await prisma.appointment.count({
    where: { patient: { email: userEmail } },
  });

  // Prescription count
  const prescriptionCount = await prisma.prescription.count({
    where: {
      appointment: {
        patient: { email: userEmail },
      },
    },
  });

  // Review count
  const reviewCount = await prisma.review.count({
    where: { patient: { email: userEmail } },
  });

  const metadata = {
    appointmentStatus,
    appointmentsCount,
    prescriptionCount,
    reviewCount,
  };
  return { message: "Patient metadata retrieved successfully", metadata };
};

// Metadata service object
const MetadataService = {
  getMetadata,
};

export default MetadataService;
