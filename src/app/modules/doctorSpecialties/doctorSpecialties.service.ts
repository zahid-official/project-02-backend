import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";

// Create doctorSpecialties
const createDoctorSpecialties = async (
  payload: Prisma.DoctorSpecialtiesCreateInput
) => {
  const result = await prisma.doctorSpecialties.create({
    data: payload,
  });

  return result;
};

// DoctorSpecialties service object
const DoctorSpecialtiesService = {
  createDoctorSpecialties,
};

export default DoctorSpecialtiesService;
