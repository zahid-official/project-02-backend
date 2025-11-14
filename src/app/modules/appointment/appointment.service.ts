import prisma from "../../config/prisma";
import { v4 as uuidv4 } from "uuid";
import stripe from "../../config/stripe";
import config from "../../config";

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
      meetingId: uuidv4(),
    };

    // Create appointment
    const appointment = await transactionRoleback.appointment.create({
      data: appointmentData,
    });

    // Update schedule as booked
    await transactionRoleback.doctorSchedule.update({
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

    // Create payment
    const payment = await transactionRoleback.payment.create({
      data: {
        appointmentId: appointment.id,
        transactionId: uuidv4(),
        amount: doctor?.appointmentFee,
      },
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: patient.email,
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
        appointmentId: appointment.id,
        paymentId: payment.id,
      },
      success_url: `${config.stripe.success_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.stripe.cancel_url}`,
    });

    return { paymentURL: session.url };
  });

  return result;
};

// Appointment service object
const AppointmentService = {
  createAppointment,
};

export default AppointmentService;
