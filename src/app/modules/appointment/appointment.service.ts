import prisma from "../../config/prisma";
import { v4 as uuidv4 } from "uuid";

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
    await transactionRoleback.payment.create({
      data: {
        appointmentId: appointment.id,
        transactionId: uuidv4(),
        amount: doctor?.appointmentFee,
      },
    });

    return appointment;
  });

  return result;
};

// Appointment service object
const AppointmentService = {
  createAppointment,
};

export default AppointmentService;
