import prisma from "../../config/prisma";
import shortid from "shortid";
import stripe from "../../config/stripe";
import config from "../../config";
import { IPagination } from "../user/user.interface";
import paginationHelper from "../../utils/paginationHelper";
import { Prisma, UserRole } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../error/AppError";

// Get my appointments
const getMyAppointments = async (
  userRole: string,
  userEmail: string,
  paginationOptions: IPagination,
  filterOptions: Record<string, unknown>
) => {
  // Pagination options
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper(paginationOptions);

  // Filter options
  const { ...filterableFields } = filterOptions;
  const andConditions: Prisma.AppointmentWhereInput[] = [];
  // Apply role-based filters
  if (userRole === UserRole.PATIENT) {
    andConditions.push({
      patient: { email: userEmail },
    });
  }

  // Apply role-based filters
  if (userRole === UserRole.DOCTOR) {
    andConditions.push({
      doctor: { email: userEmail },
    });
  }

  // Other exact match filters
  if (Object.keys(filterableFields).length > 0) {
    andConditions.push({
      ...filterableFields,
    });
  }

  // 🧩 Final where condition
  const where: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Fetch appointments
  const result = await prisma.appointment.findMany({
    take: limit,
    skip,
    where,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include:
      userRole === UserRole.DOCTOR ? { patient: true } : { doctor: true },
  });

  // pagination data
  const total = await prisma.appointment.count({ where });
  const meta = {
    limit,
    page,
    total,
  };

  return { data: result, meta };
};

// Create appointment
const createAppointment = async (
  userEmail: string,
  payload: { doctorId: string; scheduleId: string }
) => {
  // Validate patient existence
  const patient = await prisma.patient.findUniqueOrThrow({
    where: { email: userEmail },
  });

  // Validate doctor existence
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { id: payload?.doctorId, isDeleted: false },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  // Validate schedule availability
  await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: payload?.doctorId,
      scheduleId: payload?.scheduleId,
      isBooked: false,
    },
  });

  const result = await prisma.$transaction(async (transactionRoleback) => {
    const appointmentData = {
      patientId: patient?.id,
      doctorId: payload?.doctorId,
      scheduleId: payload?.scheduleId,
      meetingId: shortid.generate(),
    };

    // Create appointment
    const appointment = await transactionRoleback.appointment.create({
      data: appointmentData,
    });

    // Create payment
    const payment = await transactionRoleback.payment.create({
      data: {
        appointmentId: appointment.id,
        transactionId: shortid.generate(),
        amount: doctor?.appointmentFee,
      },
    });

    // Update schedule as booked
    const doctorSchedule = await transactionRoleback.doctorSchedule.update({
      where: {
        scheduleId_doctorId: {
          doctorId: payload?.doctorId,
          scheduleId: payload?.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: patient.email,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Appointment with Dr. ${doctor.name}`,
              description: `Consultation for ${
                doctor.doctorSpecialties?.[0].specialties?.title ?? "General"
              }`,
            },
            unit_amount: Math.round(doctor.appointmentFee * 100), // in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        doctorId: doctor.id,
        patientId: patient.id,
        paymentId: payment.id,
        appointmentId: appointment.id,
        scheduleId: doctorSchedule.scheduleId,
      },
      success_url: `${config.stripe.success_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.stripe.cancel_url}`,
    });

    return { paymentURL: session.url };
  });

  return result;
};

// Update appointment
const updateAppointment = async (
  userEmail: string,
  appointmentId: string,
  payload: Partial<Prisma.AppointmentUpdateInput>
) => {
  // Validate appointment existence
  const appointment = await prisma.appointment.findUniqueOrThrow({
    where: { id: appointmentId },
    include: { doctor: true },
  });

  if (userEmail !== appointment.doctor.email) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this appointment"
    );
  }

  // Update appointment
  const result = await prisma.appointment.update({
    where: { id: appointmentId },
    data: payload,
  });

  return result;
};

// Appointment service object
const AppointmentService = {
  getMyAppointments,
  createAppointment,
  updateAppointment,
};

export default AppointmentService;
