import z from "zod";

// Create doctor schedule schema
export const createDoctorScheduleZodSchema = z.object({
  // ScheduleIds
  scheduleIds: z.array(
    z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Schedule Id is required"
            : "Schedule Id must be a string",
      })
      .min(2, { error: "Schedule Id must be at least 2 characters long." })
      .trim()
  ),
});
