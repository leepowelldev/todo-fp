import type * as TE from "fp-ts/TaskEither";
import { type CreateTodoDTO } from "../dtos/create-todo.dto";
import { type TodoDataSourceDTO } from "../dtos/todo-data-source.dto";
import { type UpdateTodoDTO } from "../dtos/update-todo.dto";

export class TodoDataSourceError extends Error {
  readonly name = "DataSourceError";
  readonly type:
    | "NOT_FOUND" // Resource could not be found
    | "CONFLICT" // Conflict with the requested resource and/or action i.e. a database constraint
    | "BAD_REQUEST" // There was something wrong with the create/update data, possibly malformed, or invalid
    | "UNKNOWN"; // An unknown error has occurred

  constructor(
    type: TodoDataSourceError["type"],
    message?: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.type = type;
  }
}

export type TodoDataSource = {
  findAll(): TE.TaskEither<
    TodoDataSourceError,
    ReadonlyArray<TodoDataSourceDTO>
  >;
  findOne(id: string): TE.TaskEither<TodoDataSourceError, TodoDataSourceDTO>;
  create(
    data: CreateTodoDTO,
  ): TE.TaskEither<TodoDataSourceError, TodoDataSourceDTO>;
  update(
    id: string,
    data: UpdateTodoDTO,
  ): TE.TaskEither<TodoDataSourceError, TodoDataSourceDTO>;
  remove(id: string): TE.TaskEither<TodoDataSourceError, TodoDataSourceDTO>;
};
