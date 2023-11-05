import { type TodoDataSource } from "../data-sources/todo.data-source";
import { type Todo } from "../../domain/entities/todo.entity";
import { type CreateTodoDTO } from "../dtos/create-todo.dto";
import { parseTodo } from "../../shared/parsers";
import { type TodoRepository } from "../../domain/repos/todo.repo";
import { type UpdateTodoDTO } from "../dtos/update-todo.dto";

export async function findAll(
  dataSource: TodoDataSource,
): Promise<ReadonlyArray<Todo>> {
  return (await dataSource.findAll()).map((todoDTO) => parseTodo(todoDTO));
}

export async function findOne(
  dataSource: TodoDataSource,
  id: string,
): Promise<Todo | null> {
  const todoDTO = await dataSource.findOne(id);

  if (todoDTO === null) {
    return null;
  }

  return parseTodo(todoDTO);
}

export async function create(
  dataSource: TodoDataSource,
  data: CreateTodoDTO,
): Promise<Todo> {
  const todoDTO = await dataSource.create(data);
  return parseTodo(todoDTO);
}

export async function update(
  dataSource: TodoDataSource,
  id: string,
  data: UpdateTodoDTO,
): Promise<Todo> {
  const todoDTO = await dataSource.update(id, data);
  return parseTodo(todoDTO);
}

export async function remove(
  dataSource: TodoDataSource,
  id: string,
): Promise<Todo> {
  const todoDTO = await dataSource.remove(id);
  return parseTodo(todoDTO);
}

export function createTodoRepository(
  dataSource: TodoDataSource,
): TodoRepository {
  return {
    findAll: async () => await findAll(dataSource),
    findOne: async (id: string) => await findOne(dataSource, id),
    create: async (data: CreateTodoDTO) => await create(dataSource, data),
    update: async (id: string, data: UpdateTodoDTO) =>
      await update(dataSource, id, data),
    remove: async (id: string) => await remove(dataSource, id),
  };
}
