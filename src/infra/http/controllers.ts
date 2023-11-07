import { type NextFunction, type Request, type Response } from "express";
import * as E from "fp-ts/Either";
import { pipe, flow } from "fp-ts/function";
import * as RA from "fp-ts/ReadonlyArray";
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
): (ma: E.Either<unknown, unknown>) => void {
  return E.match(
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
  const result = await repo.findAll()();

  pipe(
    result,
    E.flatMap(flow(RA.map(safeParseTodoResponseDTO), E.sequenceArray)),
    handleErrorOrSuccess(response),
  );
}

export async function getTodoController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const dataSource = createPrismaTodoDataSource(client.todo);
  const repo = createTodoRepository(dataSource);
  const result = await repo.findOne(request.params.id)();

  pipe(
    result,
    E.flatMap(safeParseTodoResponseDTO),
    handleErrorOrSuccess(response),
  );
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
    E.match(
      async (error) => {
        Respond.badRequest(response, error.cause?.errors);
      },
      async (createTodoDTO) => {
        const dataSource = createPrismaTodoDataSource(client.todo);
        const repo = createTodoRepository(dataSource);
        const result = await repo.create(createTodoDTO)();

        pipe(
          result,
          E.flatMap(safeParseTodoResponseDTO),
          handleErrorOrSuccess(response),
        );
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
    E.match(
      async (error) => {
        Respond.badRequest(response, error.cause?.errors);
      },
      async (todo) => {
        const dataSource = createPrismaTodoDataSource(client.todo);
        const repo = createTodoRepository(dataSource);
        const result = await repo.update(id, todo)();

        pipe(
          result,
          E.flatMap(safeParseTodoResponseDTO),
          handleErrorOrSuccess(response),
        );
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
  const result = await repo.remove(id)();

  pipe(
    result,
    E.flatMap(safeParseTodoResponseDTO),
    handleErrorOrSuccess(response),
  );
}
