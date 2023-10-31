import { type Response } from "express";
import statuses from "statuses";

function createStatusResponse(statusCode: number) {
  return function statusResponse(response: Response) {
    response.sendStatus(statusCode);
  };
}

function createMessageResponse(statusCode: number) {
  return function messageResponse(response: Response, message?: any) {
    response.status(statusCode).json({
      message: message ?? statuses(statusCode),
    });
  };
}

function createDataResponse(statusCode: number) {
  return function dataResponse(response: Response, data: unknown) {
    response.status(statusCode).json(data);
  };
}

export const ok = createDataResponse(200);
export const created = createDataResponse(201);
export const noContent = createStatusResponse(204);
export const badRequest = createMessageResponse(400);
export const unauthorized = createMessageResponse(401);
export const paymentRequired = createMessageResponse(402);
export const forbidden = createMessageResponse(403);
export const notFound = createMessageResponse(404);
export const methodNotAllowed = createMessageResponse(405);
export const notAcceptable = createMessageResponse(406);
export const conflict = createMessageResponse(409);
export const unsupportedMediaType = createMessageResponse(415);
export const fail = createMessageResponse(500);
