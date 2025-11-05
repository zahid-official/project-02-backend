import prisma from "../../config/prisma";

// Get all users
const getAllUsers = async (limit: number, page: number) => {
  const skip = (page - 1) * limit;

  const result = await prisma.user.findMany({ skip, take: limit });

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
