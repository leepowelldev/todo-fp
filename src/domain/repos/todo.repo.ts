import type * as TaskEither from "fp-ts/TaskEither";
import type * as Option from "fp-ts/Option";
import { type Todo } from "../entities/todo.entity";
import { type CreateTodoDTO } from "../../infra/dtos/create-todo.dto";
import { type UpdateTodoDTO } from "../../infra/dtos/update-todo.dto";

export type TodoNotFoundError = { type: "TODO_NOT_FOUND"; id: string };

export type TodoRepository = {
  findAll(): TaskEither.TaskEither<Error, ReadonlyArray<Todo>>;
  findOne(id: string): TaskEither.TaskEither<Error, Option.Option<Todo>>;
  create(data: CreateTodoDTO): TaskEither.TaskEither<Error, Todo>;
  update(id: string, data: UpdateTodoDTO): TaskEither.TaskEither<Error, Todo>;
  remove(id: string): TaskEither.TaskEither<Error, Todo>;
};
