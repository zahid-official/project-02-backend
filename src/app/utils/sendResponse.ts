import { Response } from "express";

// Interface for IPayload
interface IPayload<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T | null | undefined;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

const sendResponse = <T>(res: Response, payload: IPayload<T>) => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data || null || undefined,
    meta: payload.meta || null || undefined,
  });
};

export default sendResponse;
