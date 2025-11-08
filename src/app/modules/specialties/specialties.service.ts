import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";

// Create specialties
const createSpecialties = async (payload: Prisma.SpecialtiesCreateInput) => {
  const result = await prisma.specialties.create({
    data: payload,
  });

  return result;
};

// Specialties service object
const SpecialtiesService = {
  createSpecialties,
};

export default SpecialtiesService;
