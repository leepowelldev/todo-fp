import { type NextFunction, type Request, type Response } from "express";
import { createTodoRepository } from "../repos/todo.repo";
import { createPrismaTodoDataSource } from "../data-sources/todo.data-source";
import { zodParseToResult } from "../../shared/utils/parsers/zod-parse-to-result";
import { parseCreateTodoDTO, parseUpdateTodoDTO } from "../../shared/parsers";
import { client } from "../database/client";
import { isResultError } from "../../shared/errors/result-error";
import * as Respond from "./responses";

function createHandleError(response: Response, next: NextFunction) {
  return function handleError(error: unknown) {
    if (!isResultError(error)) {
      next(error);
      return;
    }

    switch (error.name) {
      case "REPOSITORY_NOT_FOUND_ERROR": {
        // TODO find better way of handling these
        console.log(error.error);
        Respond.notFound(response);
        break;
      }
      case "REPOSITORY_CONFLICT_ERROR": {
        console.log(error.error);
        Respond.conflict(response);
        break;
      }
      case "REPOSITORY_QUERY_ERROR": {
        console.log(error.error);
        Respond.badRequest(response);
        break;
      }
      default: {
        next(error);
      }
    }
  };
}

export async function getTodosController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const dataSource = createPrismaTodoDataSource(client.todo);
  const repo = createTodoRepository(dataSource);
  const result = await repo.findAll();

  result.match(
    (todos) => {
      Respond.ok(response, todos);
    },
    createHandleError(response, next),
  );
}

export async function getTodoController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const dataSource = createPrismaTodoDataSource(client.todo);
  const repo = createTodoRepository(dataSource);
  const result = await repo.findOne(request.params.id);

  result.match(
    (todo) => {
      if (todo === null) {
        Respond.notFound(response);
        return;
      }
      Respond.ok(response, todo);
    },
    createHandleError(response, next),
  );
}

export async function createTodoController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { body } = request;

  const parseResult = zodParseToResult(parseCreateTodoDTO, body);

  if (parseResult.isErr()) {
    Respond.badRequest(response, parseResult.error.errors);
    return;
  }

  const dataSource = createPrismaTodoDataSource(client.todo);
  const repo = createTodoRepository(dataSource);
  const result = await repo.create(parseResult.value);

  result.match(
    (todo) => {
      Respond.ok(response, todo);
    },
    createHandleError(response, next),
  );
}

export async function updateTodoController(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = request.params;
  const { body } = request;
  const parseResult = zodParseToResult(parseUpdateTodoDTO, body);

  if (parseResult.isErr()) {
    Respond.badRequest(response, parseResult.error.errors);
    return;
  }

  const dataSource = createPrismaTodoDataSource(client.todo);
  const repo = createTodoRepository(dataSource);
  const result = await repo.update(id, parseResult.value);

  result.match(
    (todo) => {
      Respond.ok(response, todo);
    },
    createHandleError(response, next),
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

  result.match(
    (todo) => {
      Respond.ok(response, todo);
    },
    createHandleError(response, next),
  );
}
