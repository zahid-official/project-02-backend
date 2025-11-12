import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";

// Get doctor specialties
const getDoctorSpeialties = async () => {
  const result = await prisma.doctorSpecialties.findMany(); 
  return result;
};

// Create doctor specialties
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
  getDoctorSpeialties,
  createDoctorSpecialties,
};

export default DoctorSpecialtiesService;
