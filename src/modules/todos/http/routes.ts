import { Router } from "express";
import { route } from "../../../infra/http/route";
import {
  createTodoController,
  getTodoController,
  getTodosController,
} from "./controllers";

export const router = Router();

router.get("/", route(getTodosController));
router.post("/", route(createTodoController));
router.get("/:id", route(getTodoController));
