import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
    };
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;
  if (typeof token !== "string") {
    res.status(401).json({
      error: "Authorization header is missing or invalid",
    });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtConfig.accessSecret) as {
      sub: string;
      email: string;
    };
    (req as any).user = {
      id: payload.sub,
      email: payload.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
