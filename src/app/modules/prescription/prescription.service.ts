import { AppointmentStatus, PaymentStatus, Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import { IPagination } from "../user/user.interface";
import paginationHelper from "../../utils/paginationHelper";

// Get all prescriptions
const getAllPrescriptions = async (
  userEmail: string,
  paginationOptions: IPagination
) => {
  // Pagination options
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper(paginationOptions);

  // Where condition
  const where: Prisma.PrescriptionWhereInput = {
    patient: {
      email: userEmail,
      isDeleted: false,
    },
  };

  // Find prescriptions
  const result = await prisma.prescription.findMany({
    where,
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      patient: true,
      doctor: true,
      appointment: true,
    },
  });

  // / pagination data
  const total = await prisma.prescription.count({ where });
  const meta = {
    limit,
    page,
    total,
  };

  return { data: result, meta };
};

// Create prescriptions
const createPrescription = async (
  userEmail: string,
  payload: {
    appointmentId: string;
    instructions: string;
    followUpDate?: string;
  }
) => {
  const appointment = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload?.appointmentId,
      paymentStatus: PaymentStatus.PAID,
      appointmentStatus: AppointmentStatus.COMPLETED,
    },
    include: { doctor: true },
  });

  if (userEmail !== appointment.doctor.email) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to create prescription for this appointment"
    );
  }

  const result = await prisma.prescription.create({
    data: {
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      appointmentId: payload?.appointmentId,
      instructions: payload?.instructions,
      followUpDate: new Date(payload?.followUpDate || ""),
    },
  });

  return result;
};

// Prescription service object
const PrescriptionService = {
  getAllPrescriptions,
  createPrescription,
};

export default PrescriptionService;
