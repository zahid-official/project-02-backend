import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import paginationHelper from "../../utils/paginationHelper";
import { IPagination } from "./user.interface";
import whereClause from "../../utils/whereClause";

// Get all users
const getAllUsers = async (
  paginationOptions: IPagination,
  filterOptions: Record<string, unknown>
) => {
  // Pagination options
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper(paginationOptions);

  // Filter options
  const searchableFields = ["email"];
  const where = whereClause(filterOptions, searchableFields);

  // Find posts
  const result = await prisma.user.findMany({
    take: limit,
    skip,
    where,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // pagination data
  const total = await prisma.user.count({ where });
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
