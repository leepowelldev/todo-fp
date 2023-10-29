import { Result, type ResultAsync, ok } from "neverthrow";
import {
  type DataSourceError,
  type TodoDataSource,
} from "../data-sources/todo.data-source";
import { type Todo } from "../entities/todo.entity";
import { parseTodo } from "../utils/parsers";

export type TodoRepositoryError =
  | {
      type: "TODO_REPOSITORY_CREATE_ENTITY_FAILED";
      error?: Error;
    }
  | DataSourceError;

export type TodoRepository = {
  findAll(): ResultAsync<ReadonlyArray<Todo>, Error>;
  findOne(id: string): ResultAsync<Todo | null, Error>;
  // create(): ResultAsync<Todo, Error>;
  // update(): ResultAsync<Todo, Error>;
  // delete(): ResultAsync<Todo, Error>;
};

export function findAll(
  dataSource: TodoDataSource,
): ResultAsync<ReadonlyArray<Todo>, TodoRepositoryError> {
  return dataSource
    .findAll()
    .andThen((todoDOs) => {
      const parsedTodos = todoDOs.map((todoDO) => parseTodo(todoDO));
      return Result.combine(parsedTodos);
    })
    .mapErr((error) => {
      if (error.type === "PARSE_ERROR") {
        return {
          type: "TODO_REPOSITORY_CREATE_ENTITY_FAILED",
          error: error.error,
        };
      }
      return error;
    });
}

export function findOne(
  dataSource: TodoDataSource,
  id: string,
): ResultAsync<Todo | null, Error> {
  return dataSource.findOne(id).andThen((todoDO) => {
    if (todoDO !== null) {
      return parseTodo(todoDO);
    }
    return ok(null);
  });
}

export function createTodoRepository(
  dataSource: TodoDataSource,
): TodoRepository {
  return {
    findAll: () => findAll(dataSource),
    findOne: (id: string) => findOne(dataSource, id),
  };
}
