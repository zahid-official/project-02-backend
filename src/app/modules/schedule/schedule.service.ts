import { Prisma } from "@prisma/client";
import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../config/prisma";
import paginationHelper from "../../utils/paginationHelper";
import { IPagination } from "../user/user.interface";
import { ISchedule } from "./schedule.interface";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

// Get all schedules
const getAllSchedules = async (
  paginationOptions: IPagination,
  filterOptions: Record<string, unknown>,
  userEmail: string
) => {
  // Pagination options
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper(paginationOptions);

  // Filter out doctorScheduleIds
  const doctorSchedules = await prisma.doctorSchedule.findMany({
    where: {
      doctor: {
        email: userEmail,
      },
    },
    select: {
      scheduleId: true,
    },
  });

  const doctorScheduleIds = doctorSchedules?.map(
    (schedule) => schedule.scheduleId
  );

  // Filter options
  const where: Prisma.ScheduleWhereInput = {
    AND: [
      { startDateTime: { gte: filterOptions?.startDateTime as string } },
      { endDateTime: { lte: filterOptions?.endDateTime as string } },
    ],
    id: {
      notIn: doctorScheduleIds,
    },
  };

  // Find posts
  const result = await prisma.schedule.findMany({
    take: limit,
    skip,
    where,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // pagination data
  const total = await prisma.schedule.count({ where });
  const meta = {
    limit,
    page,
    total,
  };

  return { data: result, meta };
};

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

  // If no schedules were created, throw an error
  if (schedules.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No new schedules were created. All time slots already exist."
    );
  }

  return schedules;
};

// Delete schedule
const deleteSchedule = async (scheduleId: string) => {
  const result = await prisma.schedule.delete({
    where: {
      id: scheduleId,
    },
  });

  return result;
};

// Schedule service object
const ScheduleService = {
  getAllSchedules,
  createSchedule,
  deleteSchedule,
};

export default ScheduleService;
