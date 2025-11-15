import prisma from "../../config/prisma";

// Get all doctor schedules
const getAllDoctorSchedules = async () => {
  const result = await prisma.doctorSchedule.findMany();
  return result;
};

// Create doctor schedule
const createDoctorSchedule = async (
  doctorEmail: string,
  payload: { scheduleIds: string[] }
) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: doctorEmail,
    },
  });

  const doctorScheduleData = payload?.scheduleIds?.map((scheduleId) => ({
    doctorId: doctor?.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedule.createManyAndReturn({
    data: doctorScheduleData,
  });

  return result;
};

// Doctor schedule service object
const DoctorScheduleService = {
  getAllDoctorSchedules,
  createDoctorSchedule,
};

export default DoctorScheduleService;
