import { type Either, right, isLeft } from "fp-ts/Either";

import {
  type DataSourceError,
  type TodoDataSource,
} from "../data-sources/todo.data-source";
import { type Todo } from "../entities/todo.entity";
import { parseTodo } from "../utils/parsers";

export type TodoRepositoryError = DataSourceError;

export type TodoRepository = {
  findAll(): Promise<Either<TodoRepositoryError, ReadonlyArray<Todo>>>;
  findOne(id: string): Promise<Either<TodoRepositoryError, Todo | null>>;
  // create(): ResultAsync<Todo, Error>;
  // update(): ResultAsync<Todo, Error>;
  // delete(): ResultAsync<Todo, Error>;
};

export async function findAll(
  dataSource: TodoDataSource,
): Promise<Either<TodoRepositoryError, ReadonlyArray<Todo>>> {
  const result = await dataSource.findAll();

  if (isLeft(result)) {
    return result;
  }

  return right(result.right.map((todoDO) => parseTodo(todoDO)));
}

export async function findOne(
  dataSource: TodoDataSource,
  id: string,
): Promise<Either<TodoRepositoryError, Todo | null>> {
  const result = await dataSource.findOne(id);

  if (isLeft(result)) {
    return result;
  }

  return right(parseTodo(result.right));
}

export function createTodoRepository(
  dataSource: TodoDataSource,
): TodoRepository {
  return {
    findAll: async () => await findAll(dataSource),
    findOne: async (id: string) => await findOne(dataSource, id),
  };
}
