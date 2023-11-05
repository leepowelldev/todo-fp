import { type Todo } from "../entities/todo.entity";
import { type CreateTodoDTO } from "../../infra/dtos/create-todo.dto";
import { type UpdateTodoDTO } from "../../infra/dtos/update-todo.dto";

export type TodoRepository = {
  findAll(): Promise<ReadonlyArray<Todo>>;
  findOne(id: string): Promise<Todo | null>;
  create(data: CreateTodoDTO): Promise<Todo>;
  update(id: string, data: UpdateTodoDTO): Promise<Todo>;
  remove(id: string): Promise<Todo>;
};
