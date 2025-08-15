import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import mongoose from "mongoose";
import env from "../config/env.config";

interface ApiErr {
  statusCode?: number;
  success?: boolean;
  message?: string;
  error?: any[];
  data?: any;
  stack?: string;
}
const errorMiddleware = (
  err: ApiErr,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode: number =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;
    const message = error.message || "Something went wrong";

    error = new ApiError(statusCode, message, error?.error || [], error.stack);
  }
  const response = {
    ...error,
    message: error.message,
    ...(env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };
  res.status(error.statusCode || 500).json(response);
};

export default errorMiddleware;
