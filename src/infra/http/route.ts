import {
  type NextFunction,
  type RequestHandler,
  type Request,
  type Response,
} from "express";
import { type Controller } from "./controller";

export function route(controller: Controller): RequestHandler {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      await controller(request, response, next);
    } catch (caught) {
      next(caught);
    }
  };
}
