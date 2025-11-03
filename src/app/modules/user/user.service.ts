import { Patient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import config from "../../../config";
import prisma from "../../../config/prisma";
import { CreatePatient } from "./user.interface";

// Create patient
const createPatient = async (payload: CreatePatient) => {
  const hashedPassword = await bcrypt.hash(
    payload?.password,
    config.bcrypt_salt
  );

  const result = await prisma.$transaction(async (transactionId) => {
    // Create user
    await transactionId.user.create({
      data: {
        email: payload?.email,
        password: hashedPassword,
      },
    });

    // Create patient
    const patient = await transactionId.patient.create({
      data: {
        name: payload?.name,
        email: payload?.email,
        gender: "MALE",
        phone: payload?.phone,
      },
    });
    return patient;
  });

  return result;
};

// User service object
const UserService = {
  createPatient,
};

export default UserService;
