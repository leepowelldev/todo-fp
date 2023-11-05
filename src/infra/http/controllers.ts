import { type NextFunction, type Request, type Response } from "express";
import * as Either from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { createTodoRepository } from "../repos/todo.repo";
import { createPrismaTodoDataSource } from "../data-sources/todo.data-source";
import {
  parseTodoResponseDTO,
  safeParseCreateTodoDTO,
  safeParseUpdateTodoDTO,
} from "../../shared/parsers";
import { client } from "../database/client";
import * as Respond from "./responses";

export async function getTodosController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const dataSource = createPrismaTodoDataSource(client.todo);
  const repo = createTodoRepository(dataSource);
  const result = await repo.findAll();

  Respond.ok(response, result);
}

export async function getTodoController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const dataSource = createPrismaTodoDataSource(client.todo);
  const repo = createTodoRepository(dataSource);
  const result = await repo.findOne(request.params.id);

  if (result === null) {
    Respond.notFound(response);
    return;
  }

  Respond.ok(response, parseTodoResponseDTO(result));
}

export async function createTodoController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { body } = request;

  await pipe(
    body,
    safeParseCreateTodoDTO,
    Either.match(
      async (error) => {
        Respond.badRequest(response, error.errors);
      },
      async (todo) => {
        const dataSource = createPrismaTodoDataSource(client.todo);
        const repo = createTodoRepository(dataSource);
        const result = await repo.create(todo);

        Respond.ok(response, parseTodoResponseDTO(result));
      },
    ),
  );
}

export async function updateTodoController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = request.params;
  const { body } = request;

  await pipe(
    body,
    safeParseUpdateTodoDTO,
    Either.match(
      async (error) => {
        Respond.badRequest(response, error.errors);
      },
      async (todo) => {
        const dataSource = createPrismaTodoDataSource(client.todo);
        const repo = createTodoRepository(dataSource);
        const result = await repo.update(id, todo);

        Respond.ok(response, parseTodoResponseDTO(result));
      },
    ),
  );
}

export async function deleteTodoController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = request.params;
  const dataSource = createPrismaTodoDataSource(client.todo);
  const repo = createTodoRepository(dataSource);
  const result = await repo.remove(id);

  Respond.ok(response, parseTodoResponseDTO(result));
}
