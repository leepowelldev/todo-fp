import { type ResultAsync, ok } from "neverthrow";
import {
  type DataSourceError,
  type TodoDataSource,
} from "../data-sources/todo.data-source";
import { type Todo } from "../entities/todo.entity";
import { type CreateTodoDTO } from "../dtos/create-todo.dto";
import { parseTodo } from "../utils/parsers";

export type TodoRepositoryError = DataSourceError;

export type TodoRepository = {
  findAll(): ResultAsync<ReadonlyArray<Todo>, TodoRepositoryError>;
  findOne(id: string): ResultAsync<Todo | null, TodoRepositoryError>;
  create(data: CreateTodoDTO): ResultAsync<Todo, TodoRepositoryError>;
  // update(): ResultAsync<Todo, TodoRepositoryError>;
  // delete(): ResultAsync<Todo, TodoRepositoryError>;
};

export function findAll(
  dataSource: TodoDataSource,
): ResultAsync<ReadonlyArray<Todo>, TodoRepositoryError> {
  return dataSource
    .findAll()
    .andThen((todoDOs) => ok(todoDOs.map((todoDO) => parseTodo(todoDO))));
}

export function findOne(
  dataSource: TodoDataSource,
  id: string,
): ResultAsync<Todo | null, TodoRepositoryError> {
  return dataSource.findOne(id).andThen((todoDO) => {
    if (todoDO !== null) {
      return ok(parseTodo(todoDO));
    }
    return ok(null);
  });
}

export function create(
  dataSource: TodoDataSource,
  data: CreateTodoDTO,
): ResultAsync<Todo, TodoRepositoryError> {
  return dataSource.create(data).andThen((todoDO) => ok(parseTodo(todoDO)));
}

export function createTodoRepository(
  dataSource: TodoDataSource,
): TodoRepository {
  return {
    findAll: () => findAll(dataSource),
    findOne: (id: string) => findOne(dataSource, id),
    create: (data: CreateTodoDTO) => create(dataSource, data),
  };
}
