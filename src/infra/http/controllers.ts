import { type NextFunction, type Request, type Response } from "express";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as RA from "fp-ts/ReadonlyArray";
import { pipe, flow } from "fp-ts/function";
import { createTodoRepository } from "../repos/todo.repo";
import {
  type ParseError,
  safeParseCreateTodoDTO,
  safeParseTodoResponseDTO,
  safeParseUpdateTodoDTO,
} from "../../shared/parsers";
import { client } from "../database/client";
import { createPrismaTodoDataSource } from "../data-sources/prisma-todo.data-source";
import { type TodoRepositoryError } from "../../domain/repos/todo.repo";
import { TodoDataSourceError } from "../data-sources/todo.data-source";
import * as Respond from "./responses";

function handleError(response: Response, next: NextFunction) {
  return function innerHandleError(
    error: ParseError | TodoRepositoryError | TodoDataSourceError,
  ): void {
    if (error instanceof TodoDataSourceError) {
      switch (error.type) {
        case "NOT_FOUND": {
          Respond.notFound(response);
          return;
        }
        case "CONFLICT": {
          Respond.conflict(response);
          return;
        }
        case "BAD_REQUEST": {
          Respond.badRequest(response);
          return;
        }
      }
    }

    next(error);
  };
}

function handleSuccess<T>(response: Response): (value: T) => void {
  return function innerHandleSuccess(value: T) {
    Respond.ok(response, value);
  };
}

export async function getTodosController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const dataSource = createPrismaTodoDataSource(client.todo);
  const repo = createTodoRepository(dataSource);

  await pipe(
    repo.findAll(),
    TE.flatMapEither(flow(RA.map(safeParseTodoResponseDTO), E.sequenceArray)),
    TE.match(handleError(response, next), handleSuccess(response)),
  )();
}

export async function getTodoController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const dataSource = createPrismaTodoDataSource(client.todo);
  const repo = createTodoRepository(dataSource);

  await pipe(
    repo.findOne(request.params.id),
    TE.flatMapEither(safeParseTodoResponseDTO),
    TE.match(handleError(response, next), handleSuccess(response)),
  )();
}

export async function createTodoController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { body } = request;

  pipe(
    body,
    safeParseCreateTodoDTO,
    E.match(
      (error) => {
        Respond.badRequest(response, error.cause?.errors);
      },
      async (createTodoDTO) => {
        const dataSource = createPrismaTodoDataSource(client.todo);
        const repo = createTodoRepository(dataSource);

        await pipe(
          repo.create(createTodoDTO),
          TE.flatMapEither(safeParseTodoResponseDTO),
          TE.match(handleError(response, next), handleSuccess(response)),
        )();
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

  pipe(
    body,
    safeParseUpdateTodoDTO,
    E.match(
      (error) => {
        Respond.badRequest(response, error.cause?.errors);
      },
      async (updateTodoDTO) => {
        const dataSource = createPrismaTodoDataSource(client.todo);
        const repo = createTodoRepository(dataSource);

        await pipe(
          repo.update(id, updateTodoDTO),
          TE.flatMapEither(safeParseTodoResponseDTO),
          TE.match(handleError(response, next), handleSuccess(response)),
        )();
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

  await pipe(
    repo.remove(id),
    TE.flatMapEither(safeParseTodoResponseDTO),
    TE.match(handleError(response, next), handleSuccess(response)),
  )();
}
