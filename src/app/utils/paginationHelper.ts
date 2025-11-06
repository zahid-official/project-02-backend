import {
  IPagination,
  IPaginationResponse,
} from "../modules/user/user.interface";

const paginationHelper = (
  paginationOptions: IPagination
): IPaginationResponse => {
  // Pagination
  const limit = Number(paginationOptions?.limit) || 10;
  const page = Number(paginationOptions?.page) || 1;
  const skip = (page - 1) * limit;

  // Sorting
  const sortBy = (paginationOptions?.sortBy as string) || "createdAt";
  const sortOrder =
    (paginationOptions?.sortOrder as string)?.toLowerCase().trim() === "asc"
      ? "asc"
      : "desc";

  // Return pagination response
  return { limit, page, skip, sortBy, sortOrder };
};

export default paginationHelper;
