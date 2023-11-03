import { Router } from "express";
import * as Respond from "./responses";
import {
  getTodosController,
  createTodoController,
  getTodoController,
  updateTodoController,
  deleteTodoController,
} from "./controllers";
import { route } from "./route";

export const router = Router();

router.get("/", route(getTodosController));
router.post("/", route(createTodoController));
router.get("/:id", route(getTodoController));
router.patch("/:id", route(updateTodoController));
router.delete("/:id", route(deleteTodoController));

router.use("/health-check", (_, response) => {
  Respond.noContent(response);
});

router.use("*", (_, response) => {
  Respond.notFound(response);
});
