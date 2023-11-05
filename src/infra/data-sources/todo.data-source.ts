import { type PrismaClient } from "@prisma/client";
import { type CreateTodoDTO } from "../dtos/create-todo.dto";
import { type TodoDataSourceDTO } from "../dtos/todo-data-source.dto";
import { type UpdateTodoDTO } from "../dtos/update-todo.dto";

export type TodoDataSource = {
  findAll(): Promise<ReadonlyArray<TodoDataSourceDTO>>;
  findOne(id: string): Promise<TodoDataSourceDTO | null>;
  create(data: CreateTodoDTO): Promise<TodoDataSourceDTO>;
  update(id: string, data: UpdateTodoDTO): Promise<TodoDataSourceDTO>;
  remove(id: string): Promise<TodoDataSourceDTO>;
};

type TodoPrismaClient = PrismaClient["todo"];

export async function findAll(
  client: TodoPrismaClient,
): Promise<ReadonlyArray<TodoDataSourceDTO>> {
  return await client.findMany();
}

export async function findOne(
  client: TodoPrismaClient,
  id: string,
): Promise<TodoDataSourceDTO | null> {
  return await client.findUnique({
    where: {
      id,
    },
  });
}

export async function create(
  client: TodoPrismaClient,
  data: CreateTodoDTO,
): Promise<TodoDataSourceDTO> {
  return await client.create({
    data,
  });
}

export async function update(
  client: TodoPrismaClient,
  id: string,
  data: UpdateTodoDTO,
): Promise<TodoDataSourceDTO> {
  return await client.update({
    where: {
      id,
    },
    data,
  });
}

export async function remove(
  client: TodoPrismaClient,
  id: string,
): Promise<TodoDataSourceDTO> {
  return await client.delete({
    where: {
      id,
    },
  });
}

export function createPrismaTodoDataSource(
  client: TodoPrismaClient,
): TodoDataSource {
  return {
    findAll: async () => await findAll(client),
    findOne: async (id: string) => await findOne(client, id),
    create: async (data: CreateTodoDTO) => await create(client, data),
    update: async (id: string, data: UpdateTodoDTO) =>
      await update(client, id, data),
    remove: async (id: string) => await remove(client, id),
  };
}
