import { flow, pipe } from "fp-ts/function";
import * as TaskEither from "fp-ts/TaskEither";
import * as Either from "fp-ts/Either";
import * as Option from "fp-ts/Option";
import { type TodoDataSource } from "../data-sources/todo.data-source";
import { type Todo } from "../../domain/entities/todo.entity";
import { type CreateTodoDTO } from "../dtos/create-todo.dto";
import { safeParseTodo } from "../../shared/parsers";
import { type TodoRepository } from "../../domain/repos/todo.repo";
import { type UpdateTodoDTO } from "../dtos/update-todo.dto";

export function findAll(
  dataSource: TodoDataSource,
): TaskEither.TaskEither<Error, ReadonlyArray<Todo>> {
  return pipe(
    dataSource.findAll(),
    TaskEither.flatMapEither((todoDTOs) =>
      pipe(
        todoDTOs.map((todoDTO) => safeParseTodo(todoDTO)),
        Either.sequenceArray,
      ),
    ),
  );
}

export function findOne(
  dataSource: TodoDataSource,
  id: string,
): TaskEither.TaskEither<Error, Option.Option<Todo>> {
  return pipe(
    dataSource.findOne(id),
    TaskEither.flatMapEither(
      flow(
        Option.match(
          () => Either.right(Option.none),
          flow(safeParseTodo, Either.map(Option.some)),
        ),
      ),
    ),
  );
}

export function create(
  dataSource: TodoDataSource,
  data: CreateTodoDTO,
): TaskEither.TaskEither<Error, Todo> {
  return pipe(
    dataSource.create(data),
    TaskEither.flatMapEither(flow(safeParseTodo)),
  );
}

export function update(
  dataSource: TodoDataSource,
  id: string,
  data: UpdateTodoDTO,
): TaskEither.TaskEither<Error, Todo> {
  return pipe(
    dataSource.update(id, data),
    TaskEither.flatMapEither(flow(safeParseTodo)),
  );
}

export function remove(
  dataSource: TodoDataSource,
  id: string,
): TaskEither.TaskEither<Error, Todo> {
  return pipe(
    dataSource.remove(id),
    TaskEither.flatMapEither(flow(safeParseTodo)),
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
