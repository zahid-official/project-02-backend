import { Doctor, Prisma, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import config from "../../config";
import prisma from "../../config/prisma";
import AppError from "../../error/AppError";
import paginationHelper from "../../utils/paginationHelper";
import { IPagination } from "../user/user.interface";
import { IDoctor, IUpdateDoctor } from "./doctor.interface";

// Get all doctors
const getAllDoctors = async (
  paginationOptions: IPagination,
  filterOptions: Record<string, unknown>
) => {
  // Pagination options
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper(paginationOptions);

  // Filter options
  const { searchTerm, doctorSpecialties, ...filterableFields } = filterOptions;
  const searchableFields = ["name", "email"];

  const andConditions: Prisma.DoctorWhereInput[] = [];
  // Search by term
  if (searchTerm) {
    andConditions.push({
      OR: searchableFields?.map((field) => ({
        [field]: {
          contains: (searchTerm as string) || "",
          mode: "insensitive",
        },
      })),
    });
  }

  // Search by doctor specialties
  if (doctorSpecialties) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: (doctorSpecialties as string) || "",
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  // Other exact match filters
  if (Object.keys(filterableFields).length > 0) {
    andConditions.push({
      ...filterableFields,
    });
  }

  // 🧩 Final where condition
  const where: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Find posts
  const result = await prisma.doctor.findMany({
    take: limit,
    skip,
    where,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  // pagination data
  const total = await prisma.doctor.count();
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

// Doctor ai suggestion
const doctorAiSuggestion = async (payload: { symptoms: string }) => {};

// Update doctor
const updateDoctor = async (
  payload: Partial<IUpdateDoctor>,
  doctorId: string
) => {
  const { specialties, ...doctorInfo } = payload;

  const result = prisma.$transaction(async (transactionId) => {
    // Update specialties info
    if (specialties) {
      // Remove deleted specialties from the doctor
      const deletableSpecialties = specialties.filter(
        (specialty) => specialty.isDeleted
      );

      for (const deleteSpecialty of deletableSpecialties) {
        await transactionId.doctorSpecialties.deleteMany({
          where: {
            doctorId,
            specialtiesId: deleteSpecialty.specialtiesId,
          },
        });
      }

      // Add new specialties to the doctor
      const addableSpecialties = specialties.filter(
        (specialty) => !specialty.isDeleted
      );
      for (const addSpecialty of addableSpecialties) {
        await transactionId.doctorSpecialties.create({
          data: {
            doctorId,
            specialtiesId: addSpecialty.specialtiesId,
          },
        });
      }
    }

    // Update doctor info
    const updatedData = await transactionId.doctor.update({
      where: {
        id: doctorId,
      },
      data: doctorInfo,
      include: {
        doctorSpecialties: {
          include: {
            specialties: true,
          },
        },
      },
    });

    return updatedData;
  });

  return result;
};

// Doctor service object
const DoctorService = {
  getAllDoctors,
  createDoctor,
  doctorAiSuggestion,
  updateDoctor,
};

export default DoctorService;
