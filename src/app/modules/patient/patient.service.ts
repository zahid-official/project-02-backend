import { Patient } from "@prisma/client";
import bcrypt from "bcryptjs";
import config from "../../config";
import prisma from "../../config/prisma";
import { IPatient } from "./patient.interface";

// Create patient
const createPatient = async (
  payload: IPatient,
  password: string
): Promise<Patient> => {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt);

  // Create patient within a transaction
  const result = await prisma.$transaction(async (transactionId) => {
    // Create user
    await transactionId.user.create({
      data: {
        email: payload?.email,
        password: hashedPassword,
      },
    });

    // Create patient
    return await transactionId.patient.create({
      data: payload,
    });
  });

  return result;
};

// Patient service object
const PatientService = {
  createPatient,
};

export default PatientService;
