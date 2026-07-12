import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error.js";

export function errorMiddleware(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: "Validation failed",
      issues: error.issues
    });
    return;
  }

  if (error instanceof Error) {
    if (error instanceof AppError) {
      response.status(error.status).json({
        message: error.message
      });
      return;
    }

    response.status(500).json({
      message: error.message
    });
    return;
  }

  response.status(500).json({
    message: "Unexpected server error"
  });
}
