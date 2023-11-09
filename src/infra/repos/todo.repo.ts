import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import {
  type TodoDataSourceError,
  type TodoDataSource,
} from "../data-sources/todo.data-source";
import { type Todo } from "../../domain/entities/todo.entity";
import { type CreateTodoDTO } from "../dtos/create-todo.dto";
import { ParseError, safeParseTodo } from "../../shared/parsers";
import {
  TodoRepositoryError,
  type TodoRepository,
} from "../../domain/repos/todo.repo";
import { type UpdateTodoDTO } from "../dtos/update-todo.dto";
import { type TodoDataSourceDTO } from "../dtos/todo-data-source.dto";

const mapError = (
  error: ParseError | TodoDataSourceError,
): TodoRepositoryError | TodoDataSourceError => {
  if (error instanceof ParseError) {
    return new TodoRepositoryError(
      "PARSE_ERROR",
      "Error parsing todo DTO to domain entity",
      {
        cause: error,
      },
    );
  }

  return error;
};

function parseTodos(
  todoDTOs: ReadonlyArray<TodoDataSourceDTO>,
): E.Either<ParseError, ReadonlyArray<Todo>> {
  return pipe(
    todoDTOs.map((todoDTO) => safeParseTodo(todoDTO)),
    E.sequenceArray,
  );
}

function parseTodo(todoDTO: TodoDataSourceDTO): E.Either<ParseError, Todo> {
  return pipe(todoDTO, safeParseTodo);
}

export function findAll(
  dataSource: TodoDataSource,
): ReturnType<TodoRepository["findAll"]> {
  return pipe(
    dataSource.findAll(),
    TE.flatMapEither(parseTodos),
    TE.mapLeft(mapError),
  );
}

export function findOne(
  dataSource: TodoDataSource,
  id: string,
): ReturnType<TodoRepository["findOne"]> {
  return pipe(
    dataSource.findOne(id),
    TE.flatMapEither(parseTodo),
    TE.mapLeft(mapError),
  );
}

export function create(
  dataSource: TodoDataSource,
  data: CreateTodoDTO,
): ReturnType<TodoRepository["create"]> {
  return pipe(
    dataSource.create(data),
    TE.flatMapEither(parseTodo),
    TE.mapLeft(mapError),
  );
}

export function update(
  dataSource: TodoDataSource,
  id: string,
  data: UpdateTodoDTO,
): ReturnType<TodoRepository["update"]> {
  return pipe(
    dataSource.update(id, data),
    TE.flatMapEither(parseTodo),
    TE.mapLeft(mapError),
  );
}

export function remove(
  dataSource: TodoDataSource,
  id: string,
): ReturnType<TodoRepository["remove"]> {
  return pipe(
    dataSource.remove(id),
    TE.flatMapEither(parseTodo),
    TE.mapLeft(mapError),
  );
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
