import { type NextFunction, type Request, type Response } from "express";
import { createTodoRepository } from "../repos/todo.repository";
import { createPrismaTodoDataSource } from "../data-sources/todo.data-source";
import * as Respond from "../../../infra/http/responses";
import { zodParseToResult } from "../../../app/utils/parsers/zod-parse-to-result";
import { parseCreateTodoDTO } from "../utils/parsers";
import { client } from "../../../infra/database/client";

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
    (error) => {
      switch (error) {
        case "DATA_SOURCE_NOT_FOUND_ERROR": {
          Respond.notFound(response);
          break;
        }
        case "DATA_SOURCE_QUERY_ERROR": {
          Respond.badRequest(response);
          break;
        }
        default: {
          next(error);
        }
      }
    },
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
    (error) => {
      switch (error) {
        case "DATA_SOURCE_NOT_FOUND_ERROR": {
          Respond.notFound(response);
          break;
        }
        case "DATA_SOURCE_QUERY_ERROR": {
          Respond.badRequest(response);
          break;
        }
        default: {
          next(error);
        }
      }
    },
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
    (error) => {
      switch (error) {
        case "DATA_SOURCE_CONFLICT_ERROR": {
          Respond.conflict(response);
          break;
        }
        case "DATA_SOURCE_QUERY_ERROR": {
          Respond.badRequest(response);
          break;
        }
        default: {
          next(error);
        }
      }
    },
  );
}
