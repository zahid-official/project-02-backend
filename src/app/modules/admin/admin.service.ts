import { Admin, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import config from "../../config";
import prisma from "../../config/prisma";
import { IAdmin } from "./admin.interface";

// Create admin
const createAdmin = async (
  payload: IAdmin,
  password: string
): Promise<Admin> => {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt);

  // Create admin within a transaction
  const result = await prisma.$transaction(async (transactionId) => {
    // Create user
    await transactionId.user.create({
      data: {
        email: payload?.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    // Create admin
    return await transactionId.admin.create({
      data: payload,
    });
  });

  return result;
};

// Admin service object
const AdminService = {
  createAdmin,
};

export default AdminService;
