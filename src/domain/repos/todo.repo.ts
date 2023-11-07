import type * as TaskEither from "fp-ts/TaskEither";
import { type Todo } from "../entities/todo.entity";
import { type CreateTodoDTO } from "../../infra/dtos/create-todo.dto";
import { type UpdateTodoDTO } from "../../infra/dtos/update-todo.dto";
import { type TodoDataSourceError } from "../../infra/data-sources/todo.data-source";

export class TodoRepositoryError extends Error {
  readonly name = "TodoRepositoryError";
  readonly type = "PARSE_ERROR";
  constructor(
    message: string,
    type: TodoRepositoryError["type"],
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.type = type;
  }
}

export type TodoRepository = {
  findAll(): TaskEither.TaskEither<
    TodoRepositoryError | TodoDataSourceError,
    ReadonlyArray<Todo>
  >;
  findOne(
    id: string,
  ): TaskEither.TaskEither<TodoRepositoryError | TodoDataSourceError, Todo>;
  create(
    data: CreateTodoDTO,
  ): TaskEither.TaskEither<TodoRepositoryError | TodoDataSourceError, Todo>;
  update(
    id: string,
    data: UpdateTodoDTO,
  ): TaskEither.TaskEither<TodoRepositoryError | TodoDataSourceError, Todo>;
  remove(
    id: string,
  ): TaskEither.TaskEither<TodoRepositoryError | TodoDataSourceError, Todo>;
};
