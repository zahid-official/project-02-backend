import { Patient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import config from "../../config";
import prisma from "../../config/prisma";
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
        email: payload?.patient?.email,
        password: hashedPassword,
      },
    });

    // Create patient
    return await transactionId.patient.create({
      data: {
        name: payload?.patient?.name,
        email: payload?.patient?.email,
        gender: "MALE",
        phone: payload?.patient?.phone,
        profilePhoto: payload?.patient?.profilePhoto,
      },
    });
  });

  return result;
};

// User service object
const UserService = {
  createPatient,
};

export default UserService;
