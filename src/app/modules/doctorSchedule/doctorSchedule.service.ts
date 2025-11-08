import prisma from "../../config/prisma";

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
  createDoctorSchedule,
};

export default DoctorScheduleService;
