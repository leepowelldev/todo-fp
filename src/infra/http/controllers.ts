import { type NextFunction, type Request, type Response } from "express";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as RA from "fp-ts/ReadonlyArray";
import type * as T from "fp-ts/Task";
import { pipe, flow } from "fp-ts/function";
import { createTodoRepository } from "../repos/todo.repo";
import {
  TodoDataSourceError,
  createPrismaTodoDataSource,
} from "../data-sources/todo.data-source";
import {
  safeParseCreateTodoDTO,
  safeParseTodoResponseDTO,
  safeParseUpdateTodoDTO,
} from "../../shared/parsers";
import { client } from "../database/client";
import * as Respond from "./responses";

function handleErrorOrSuccess(
  response: Response,
): (ma: TE.TaskEither<unknown, unknown>) => T.Task<unknown> {
  return TE.match(
    (error) => {
      if (error instanceof TodoDataSourceError) {
        switch (error.type) {
          case "NOT_FOUND": {
            Respond.notFound(response);
            break;
          }
          case "CONFLICT": {
            Respond.conflict(response);
            break;
          }
          case "BAD_REQUEST": {
            Respond.badRequest(response);
            break;
          }
        }
      }

      console.log(error);
      Respond.fail(response);
    },
    (todoResponseDTOs) => {
      Respond.ok(response, todoResponseDTOs);
    },
  );
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
    handleErrorOrSuccess(response),
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
    handleErrorOrSuccess(response),
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
          handleErrorOrSuccess(response),
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
          handleErrorOrSuccess(response),
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
    handleErrorOrSuccess(response),
  )();
}
