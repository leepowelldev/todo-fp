import { type Request, type Response, type NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as Respond from "./responses";

export function globalErrorHandler(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  console.log(error);

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2000
      case "P2000": {
        Respond.badRequest(response);
        return;
      }
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
      case "P2002": {
        Respond.conflict(response);
        return;
      }
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
      case "P2025": {
        Respond.notFound(response);
        return;
      }
    }
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
