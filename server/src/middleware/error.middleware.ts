import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("❌ ERROR:", err);

  if (err.name === "ZodError") {
    return res.status(400).json({
      status: "fail",
      error: err.errors
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "fail",
      message: err.message
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went wrong"
  });
}