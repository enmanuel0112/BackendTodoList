import { NextFunction, Request, Response } from "express";
import { SimpleConsoleLogger } from "typeorm";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      error: "Validation error",
      issues: result.error.issues,

    });
    return
  }

  req.body = result.data;
  next();

}