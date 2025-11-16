import { UserRole } from "@prisma/client";
import prisma from "../../config/prisma";
import paginationHelper from "../../utils/paginationHelper";
import whereClause from "../../utils/whereClause";
import { IPagination } from "./user.interface";

// Get all users
const getAllUsers = async (
  paginationOptions: IPagination,
  filterOptions: Record<string, unknown>
) => {
  // Pagination options
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper(paginationOptions);

  // Filter options
  const searchableFields = ["email"];
  const where = whereClause(filterOptions, searchableFields);

  // Find posts
  const result = await prisma.user.findMany({
    take: limit,
    skip,
    where,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // pagination data
  const total = await prisma.user.count({ where });
  const meta = {
    limit,
    page,
    total,
  };

  return { data: result, meta };
};

// Get logged-in user
const getMe = async (userEmail: string, userRole: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: userEmail },
    select: {
      email: true,
      role: true,
      status: true,
      needChangePassword: true,
    },
  });

  // Fetch role-specific profile data
  let profileData;
  if (userRole === UserRole.ADMIN) {
    profileData = await prisma.admin.findUnique({
      where: { email: user.email },
    });
  }
  if (userRole === UserRole.DOCTOR) {
    profileData = await prisma.doctor.findUnique({
      where: { email: user.email },
    });
  }
  if (userRole === UserRole.PATIENT) {
    profileData = await prisma.patient.findUnique({
      where: { email: user.email },
    });
  }

  return {
    ...user,
    ...profileData,
  };
};

// User service object
const UserService = {
  getAllUsers,
  getMe,
};

export default UserService;
