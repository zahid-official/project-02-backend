import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import paginationHelper from "../../utils/paginationHelper";
import { IPagination } from "../user/user.interface";

// Get all doctor schedules
const getAllDoctorSchedules = async (
  paginationOptions: IPagination,
  filterOptions: Record<string, unknown>
) => {
  // Pagination options
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper(paginationOptions);

  // Filter options
  const { ...filterableFields } = filterOptions;
  const andConditions: Prisma.DoctorScheduleWhereInput[] = [];

  // Handle isBooked filter
  if (filterableFields?.isBooked) {
    filterableFields.isBooked =
      (filterableFields?.isBooked as string)?.toLowerCase() === "true"
        ? true
        : false;
  }

  // Other exact match filters
  if (Object.keys(filterableFields).length > 0) {
    andConditions.push({
      ...filterableFields,
    });
  }

  // 🧩 Final where condition
  const where: Prisma.DoctorScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctorSchedule.findMany({
    take: limit,
    skip,
    where,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // pagination data
  const total = await prisma.doctorSchedule.count({ where });
  const meta = {
    limit,
    page,
    total,
  };

  return { data: result, meta };
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
