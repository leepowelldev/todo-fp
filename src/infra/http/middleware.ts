import { type NextFunction, type Request, type Response } from "express";
import * as Respond from "./responses";

export function acceptsMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const accepts = request.get("accept");
  if (
    accepts !== undefined &&
    !accepts.includes("application/json") &&
    !accepts.includes("*/*")
  ) {
    Respond.notAcceptable(response);
    return;
  }
  next();
}

export function contentTypeMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const contentType = request.get("content-type");
  if (contentType !== undefined && !contentType.includes("application/json")) {
    Respond.unsupportedMediaType(response);
    return;
  }
  next();
}
