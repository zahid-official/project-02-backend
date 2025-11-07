import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../config/prisma";
import { ISchedule } from "./schedule.interface";

// Create schedule
const createSchedule = async (payload: ISchedule) => {
  const intervalTime = 30;
  const startDate = new Date(payload?.startDate);
  const endDate = new Date(payload?.endDate);
  const schedules = [];

  // Iterate through dates
  while (startDate <= endDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(startDate, "yyyy-MM-dd")}`,
          Number(payload?.startTime?.split(":")[0])
        ),
        Number(payload?.startTime?.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(startDate, "yyyy-MM-dd")}`,
          Number(payload?.endTime?.split(":")[0])
        ),
        Number(payload?.endTime?.split(":")[1])
      )
    );

    // Iterate through time slots
    while (startDateTime < endDateTime) {
      const slotStart = startDateTime;
      const slotEnd = addMinutes(startDateTime, intervalTime);

      // Check is schedule exists
      const isScheduleExists = await prisma.schedule.findFirst({
        where: {
          startDateTime: slotStart,
          endDateTime: slotEnd,
        },
      });

      // Create schedule
      if (!isScheduleExists) {
        const result = await prisma.schedule.create({
          data: {
            startDateTime: slotStart,
            endDateTime: slotEnd,
          },
        });

        schedules.push(result);
      }

      // Increment slot start time
      slotStart.setMinutes(slotStart.getMinutes() + intervalTime);
    }

    // Increment date
    startDate.setDate(startDate.getDate() + 1);
  }

  return schedules;
};

// Schedule service object
const ScheduleService = {
  createSchedule,
};

export default ScheduleService;
