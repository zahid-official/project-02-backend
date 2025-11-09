import { Doctor, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import config from "../../config";
import prisma from "../../config/prisma";
import { IDoctor } from "./doctor.interface";
import { IPagination } from "../user/user.interface";
import paginationHelper from "../../utils/paginationHelper";
import whereClause from "../../utils/whereClause";

// Get all doctors
const getAllDoctors = async (
  paginationOptions: IPagination,
  filterOptions: Record<string, unknown>
) => {
  // Pagination options
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper(paginationOptions);

  // Filter options
  const searchableFields = ["name", "email"];
  const where = whereClause(filterOptions, searchableFields);

  // Find posts
  const result = await prisma.doctor.findMany({
    take: limit,
    skip,
    where,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // pagination data
  const total = await prisma.user.count();
  const meta = {
    limit,
    page,
    total,
  };

  return { data: result, meta };
};

// Create doctor
const createDoctor = async (
  payload: IDoctor,
  password: string
): Promise<Doctor> => {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt);

  // Create doctor within a transaction
  const result = await prisma.$transaction(async (transactionId) => {
    // Create user
    await transactionId.user.create({
      data: {
        email: payload?.email,
        password: hashedPassword,
        role: UserRole.DOCTOR,
      },
    });

    // Create doctor
    return await transactionId.doctor.create({
      data: payload,
    });
  });

  return result;
};

// Doctor service object
const DoctorService = {
  getAllDoctors,
  createDoctor,
};

export default DoctorService;
