import { Router } from "express";
import { router as todosRouter } from "../../modules/todos/http/routes";
import * as Respond from "./responses";

export const router = Router();

router.use("/", todosRouter);

router.use("/health-check", (_, response) => {
  Respond.noContent(response);
});

router.use("*", (_, response) => {
  Respond.notFound(response);
});
