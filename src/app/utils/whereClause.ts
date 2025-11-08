const whereClause = (
  filterOptions: Record<string, unknown>,
  searchableFields?: string[]
) => {
  const { searchTerm, ...filterableFields } = filterOptions;
  const where = {
    AND: [
      // Search by term
      {
        OR: searchableFields?.map((field) => ({
          [field]: {
            contains: (searchTerm as string) || "",
            mode: "insensitive",
          },
        })),
      },

      // Filter by exact matches
      // {...filterableFields} // best option, below option for practice purpose

      {
        AND: Object.keys(filterableFields)?.map((field) => ({
          [field]: { equals: filterableFields[field] },
        })),
      },
    ],
  };

  return where;
};

export default whereClause;
