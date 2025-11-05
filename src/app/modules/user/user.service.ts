import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";

// Get all users
const getAllUsers = async (
  limit: number,
  page: number,
  search: string,
  sortBy: string,
  sortOrder: string
) => {
  // Where clause
  const where: Prisma.UserWhereInput = {
    email: { contains: search, mode: "insensitive" },
  };

  // Find posts
  const skip = (page - 1) * limit;
  const result = await prisma.user.findMany({
    skip,
    take: limit,
    where,

    // Sorting
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // pagination
  const total = await prisma.user.count();
  const meta = {
    limit,
    page,
    total,
  };

  return { data: result, meta };
};

// User service object
const UserService = {
  getAllUsers,
};

export default UserService;
