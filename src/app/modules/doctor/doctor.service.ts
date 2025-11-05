import { Doctor, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import config from "../../config";
import prisma from "../../config/prisma";
import { IDoctor } from "./doctor.interface";

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
  createDoctor,
};

export default DoctorService;
