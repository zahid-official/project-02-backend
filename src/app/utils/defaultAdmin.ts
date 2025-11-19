import { UserRole } from "@prisma/client";
import config from "../config";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";

const defaultAdmin = async () => {
  try {
    // Check if default admin already exists
    const defaultAdminExist = await prisma.user.findUnique({
      where: {
        email: config.defaultAdmin.email,
      },
    });

    if (defaultAdminExist) {
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      config.defaultAdmin.password as string,
      config.bcrypt_salt
    );

    await prisma.$transaction(async (transactionId) => {
      // Create user
      await transactionId.user.create({
        data: {
          email: config.defaultAdmin.email as string,
          password: hashedPassword,
          role: UserRole.ADMIN,
        },
      });

      // Create admin
      return await transactionId.admin.create({
        data: {
          name: "Default admin",
          email: config.defaultAdmin.email as string,
          phone: "01911122233",
          gender: "MALE",
        },
      });
    });

    console.log("Default admin created successfully");
  } catch (error) {
    console.error(error);
  }
};

export default defaultAdmin;
