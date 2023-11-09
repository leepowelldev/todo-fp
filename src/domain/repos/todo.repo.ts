import type * as TE from "fp-ts/TaskEither";
import { type Todo } from "../entities/todo.entity";
import { type CreateTodoDTO } from "../../infra/dtos/create-todo.dto";
import { type UpdateTodoDTO } from "../../infra/dtos/update-todo.dto";
import { type TodoDataSourceError } from "../../infra/data-sources/todo.data-source";

export class TodoRepositoryError extends Error {
  readonly name = "TodoRepositoryError";
  readonly type: "PARSE_ERROR"; // Error parsing the data source response into a domain entity

  constructor(
    type: TodoRepositoryError["type"],
    message?: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.type = type;
  }
}

export type TodoRepository = {
  findAll(): TE.TaskEither<
    TodoRepositoryError | TodoDataSourceError,
    ReadonlyArray<Todo>
  >;
  findOne(
    id: string,
  ): TE.TaskEither<TodoRepositoryError | TodoDataSourceError, Todo>;
  create(
    data: CreateTodoDTO,
  ): TE.TaskEither<TodoRepositoryError | TodoDataSourceError, Todo>;
  update(
    id: string,
    data: UpdateTodoDTO,
  ): TE.TaskEither<TodoRepositoryError | TodoDataSourceError, Todo>;
  remove(
    id: string,
  ): TE.TaskEither<TodoRepositoryError | TodoDataSourceError, Todo>;
};
