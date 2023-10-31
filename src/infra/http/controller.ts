import { type NextFunction, type Request, type Response } from "express";

export type Controller = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<void>;
