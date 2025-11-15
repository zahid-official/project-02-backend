import { AppointmentStatus, PaymentStatus, Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

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
  createPrescription,
};

export default PrescriptionService;
