import { type ResultAsync, ok } from "neverthrow";
import {
  type DataSourceError,
  type TodoDataSource,
} from "../data-sources/todo.data-source";
import { type Todo } from "../../domain/entities/todo.entity";
import { type CreateTodoDTO } from "../dtos/create-todo.dto";
import { parseTodo } from "../../shared/parsers";
import {
  type TodoRepository,
  type TodoRepositoryError,
} from "../../domain/repos/todo.repo";
import { type UpdateTodoDTO } from "../dtos/update-todo.dto";
import { createResultError } from "../../shared/errors/result-error";

function mapError(error: DataSourceError): TodoRepositoryError {
  switch (error.name) {
    case "DATA_SOURCE_CONFLICT_ERROR": {
      return createResultError("REPOSITORY_CONFLICT_ERROR", error.error);
    }
    case "DATA_SOURCE_NOT_FOUND_ERROR": {
      return createResultError("REPOSITORY_NOT_FOUND_ERROR", error.error);
    }
    case "DATA_SOURCE_QUERY_ERROR": {
      return createResultError("REPOSITORY_QUERY_ERROR", error.error);
    }
  }
}

export function findAll(
  dataSource: TodoDataSource,
): ResultAsync<ReadonlyArray<Todo>, TodoRepositoryError> {
  return dataSource
    .findAll()
    .andThen((todoDTOs) => ok(todoDTOs.map((todoDTO) => parseTodo(todoDTO))))
    .mapErr(mapError);
}

export function findOne(
  dataSource: TodoDataSource,
  id: string,
): ResultAsync<Todo | null, TodoRepositoryError> {
  return dataSource
    .findOne(id)
    .andThen((todoDTO) => {
      if (todoDTO !== null) {
        return ok(parseTodo(todoDTO));
      }
      return ok(null);
    })
    .mapErr(mapError);
}

export function create(
  dataSource: TodoDataSource,
  data: CreateTodoDTO,
): ResultAsync<Todo, TodoRepositoryError> {
  return dataSource
    .create(data)
    .andThen((todoDTO) => ok(parseTodo(todoDTO)))
    .mapErr(mapError);
}

export function update(
  dataSource: TodoDataSource,
  id: string,
  data: UpdateTodoDTO,
): ResultAsync<Todo, TodoRepositoryError> {
  return dataSource
    .update(id, data)
    .andThen((todoDTO) => ok(parseTodo(todoDTO)))
    .mapErr(mapError);
}

export function remove(
  dataSource: TodoDataSource,
  id: string,
): ResultAsync<Todo, TodoRepositoryError> {
  return dataSource
    .remove(id)
    .andThen((todoDTO) => ok(parseTodo(todoDTO)))
    .mapErr(mapError);
}

export function createTodoRepository(
  dataSource: TodoDataSource,
): TodoRepository {
  return {
    findAll: () => findAll(dataSource),
    findOne: (id: string) => findOne(dataSource, id),
    create: (data: CreateTodoDTO) => create(dataSource, data),
    update: (id: string, data: UpdateTodoDTO) => update(dataSource, id, data),
    remove: (id: string) => remove(dataSource, id),
  };
}
