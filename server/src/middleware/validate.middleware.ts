import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

type ValidationTarget = "body" | "params" | "query";

export function validate(schema: ZodSchema, target: ValidationTarget = "body") {
  return (request: Request, _response: Response, next: NextFunction) => {
    request[target] = schema.parse(request[target]);
    next();
  };
}
