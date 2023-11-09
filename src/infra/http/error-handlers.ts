import { type Request, type Response, type NextFunction } from "express";
import * as Respond from "./responses";

export function globalErrorHandler(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  console.log(error);
  if (error instanceof Error) {
    console.log(error.cause);
  }

  Respond.fail(response);
}

export function bodyParserErrorHandler(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (error instanceof SyntaxError) {
    Respond.badRequest(response);
    return;
  }
  next(error);
}
