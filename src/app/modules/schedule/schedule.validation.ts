import z from "zod";

// Create schedule schema
export const createScheduleZodSchema = z.object({
  // Start Date
  startDate: z.iso.date({
    error: (issue) =>
      issue.input === undefined
        ? "Start date is required"
        : "Start date must be in YYYY-MM-DD format.",
  }),

  // End Date
  endDate: z.iso.date({
    error: (issue) =>
      issue.input === undefined
        ? "End date is required"
        : "End date must be in YYYY-MM-DD format.",
  }),

  // Start Time
  startTime: z.iso.time({
    error: (issue) =>
      issue.input === undefined
        ? "Start time is required"
        : "Start time must be in HH:MM or HH:MM:SS format.",
  }),

  // End Time
  endTime: z.iso.time({
    error: (issue) =>
      issue.input === undefined
        ? "End time is required"
        : "End time must be in HH:MM or HH:MM:SS format.",
  }),
});
