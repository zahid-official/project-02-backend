import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";

// Get specialties
const getSpeialties = async () => {
  const result = await prisma.specialties.findMany();
  return result;
};

// Create specialties
const createSpecialties = async (payload: Prisma.SpecialtiesCreateInput) => {
  const result = await prisma.specialties.create({
    data: payload,
  });

  return result;
};

// Specialties service object
const SpecialtiesService = {
  getSpeialties,
  createSpecialties,
};

export default SpecialtiesService;
