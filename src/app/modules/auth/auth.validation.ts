import z from "zod";

// Login schema
export const loginZodSchema = z.object({
  // Email
  email: z
    .email({
      error: (issue) =>
        issue.input === undefined
          ? "Email is required"
          : "Invalid email format",
    })
    .min(5, { error: "Email must be at least 5 characters long." })
    .max(100, { error: "Email cannot exceed 100 characters." })
    .trim(),

  // Password
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Password must be string",
    })
    .min(8, { error: "Password must be at least 8 characters long." })
    .trim(),
});
