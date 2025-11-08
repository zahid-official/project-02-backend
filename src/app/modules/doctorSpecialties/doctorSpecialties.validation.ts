import z from "zod";

export const createDoctorSpecialtiesZodSchema = z.object({
  // Specialties Id
  specialtiesId: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Specialties Id is required"
          : "Specialties Id must be a string",
    })
    .min(2, { error: "Specialties Id must be at least 2 characters long." })
    .trim(),

  // Doctor Id
  doctorId: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Doctor Id is required"
          : "Doctor Id must be a string",
    })
    .min(2, { error: "Doctor Id must be at least 2 characters long." })
    .trim(),
});
