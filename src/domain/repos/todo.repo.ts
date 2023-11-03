import { type ResultAsync } from "neverthrow";
import { type Todo } from "../entities/todo.entity";
import { type CreateTodoDTO } from "../../infra/dtos/create-todo.dto";
import { type UpdateTodoDTO } from "../../infra/dtos/update-todo.dto";
import { type ResultError } from "../../shared/errors/result-error";

export type TodoRepositoryError =
  | ResultError<"REPOSITORY_NOT_FOUND_ERROR">
  | ResultError<"REPOSITORY_CONFLICT_ERROR">
  | ResultError<"REPOSITORY_QUERY_ERROR">;

export type TodoRepository = {
  findAll(): ResultAsync<ReadonlyArray<Todo>, TodoRepositoryError>;
  findOne(id: string): ResultAsync<Todo | null, TodoRepositoryError>;
  create(data: CreateTodoDTO): ResultAsync<Todo, TodoRepositoryError>;
  update(
    id: string,
    data: UpdateTodoDTO,
  ): ResultAsync<Todo, TodoRepositoryError>;
  remove(id: string): ResultAsync<Todo, TodoRepositoryError>;
};
