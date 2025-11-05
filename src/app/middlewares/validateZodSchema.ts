import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

// Middleware for zod schema validation
export const validateZodSchema =
  (zodSchema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // If the request body contains a 'data' field, parse it as JSON
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }

      // Validate the request body against the provided Zod schema
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
