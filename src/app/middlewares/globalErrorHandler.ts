import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import config from "../config";
import { Prisma } from "@prisma/client";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if response sent
  if (res.headersSent) {
    return next(error);
  }

  // Default error values
  let statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = error.message || "Something went wrong!!";
  let errorDetails = error;

  // Zod validation error handling
  if (error instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation failed";
    errorDetails = error.issues;
  }

  // Prisma error handling
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        statusCode = httpStatus.CONFLICT;
        message = `Duplicate value for unique field: ${error.meta?.target}`;
        break;

      case "P2003":
        statusCode = httpStatus.BAD_REQUEST;
        message = `Foreign key constraint failed on field: ${error.meta?.field_name}`;
        break;

      case "P2025":
        statusCode = httpStatus.NOT_FOUND;
        message =
          `Record not found: ${error.meta?.cause}` ||
          "Record not found in the database.";
        break;

      default:
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = error.message || "Database error occurred.";
    }
  }

  // Prisma validation error handling
  else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Invalid input data for Prisma query";
  }

  // Prisma initialization error handling
  else if (error instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Database connection failed. Please check your connection.";
  }

  // JWT error handling
  else if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    statusCode = httpStatus.UNAUTHORIZED;
    message = error.message;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
    stack:
      config.node_env === "development"
        ? error.stack
            ?.split("\n")
            .map((line: any) => line.trim())
            .filter((line: any) => line.startsWith("at"))
        : null,
  });
};

export default globalErrorHandler;
