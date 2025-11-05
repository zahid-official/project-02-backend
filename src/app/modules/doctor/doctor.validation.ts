import { Gender } from "@prisma/client";
import z from "zod";

// Create doctor schema
export const createDoctorZodSchema = z.object({
  doctor: z.object({
    // Name
    name: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Name is required"
            : "Name must be a string",
      })
      .min(2, { error: "Name must be at least 2 characters long." })
      .max(50, { error: "Name cannot exceed 50 characters." })
      .trim(),

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

    // Gender
    gender: z.enum(Object.values(Gender) as [string]),

    // Phone
    phone: z
      .string({ error: "Phone Number must be string" })
      .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        error:
          "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
      })
      .trim(),

    // Address
    address: z
      .string({ error: "Address must be string" })
      .max(200, { error: "Address cannot exceed 200 characters." })
      .trim()
      .optional(),

    // Registration Number
    registrationNumber: z
      .string({ error: "Registration number must be string" })
      .max(50, { error: "Registration number cannot exceed 50 characters." })
      .trim(),

    // Appointment Fee
    appointmentFee: z
      .number({ error: "Appointment fee must be a number" })
      .min(0, { error: "Appointment fee cannot be negative" }),

    // Experience
    experience: z
      .number({ error: "Experience must be a number" })
      .min(0, { error: "Experience cannot be negative" })
      .optional(),

    // Qualification
    qualification: z
      .string({ error: "Qualification must be string" })
      .max(200, { error: "Qualification cannot exceed 200 characters." })
      .trim(),

    // Designation
    designation: z
      .string({ error: "Designation must be string" })
      .max(200, { error: "Designation cannot exceed 200 characters." })
      .trim(),

    // Current Working Place
    currentWorkingPlace: z
      .string({ error: "Current working place must be string" })
      .max(200, {
        error: "Current working place cannot exceed 200 characters.",
      })
      .trim(),
  }),

  // Password
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Password must be string",
    })
    .min(8, { error: "Password must be at least 8 characters long." })

    // Password complexity requirements
    .regex(/^(?=.*[A-Z])/, {
      error: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      error: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      error: "Password must contain at least 1 number.",
    })
    .trim(),
});
