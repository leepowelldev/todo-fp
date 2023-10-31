import { type PrismaClient } from "@prisma/client";
import { type ResultAsync } from "neverthrow";
import { prismaQueryToResult } from "../../../infra/database/utils/prisma-query-to-result";
import { type CreateTodoDTO } from "../dtos/create-todo.dto";
import { type TodoDataSourceDTO } from "../dtos/todo-data-source.dto";
import { type UpdateTodoDTO } from "../dtos/update-todo.dto";

export type DataSourceError =
  | "DATA_SOURCE_NOT_FOUND_ERROR"
  | "DATA_SOURCE_CONFLICT_ERROR"
  | "DATA_SOURCE_QUERY_ERROR";

export type TodoDataSource = {
  findAll(): ResultAsync<ReadonlyArray<TodoDataSourceDTO>, DataSourceError>;
  findOne(id: string): ResultAsync<TodoDataSourceDTO | null, DataSourceError>;
  create(data: CreateTodoDTO): ResultAsync<TodoDataSourceDTO, DataSourceError>;
  update(
    id: string,
    data: UpdateTodoDTO,
  ): ResultAsync<TodoDataSourceDTO, DataSourceError>;
  remove(id: string): ResultAsync<TodoDataSourceDTO, DataSourceError>;
};

type TodoPrismaClient = PrismaClient["todo"];

export function findAll(
  client: TodoPrismaClient,
): ResultAsync<ReadonlyArray<TodoDataSourceDTO>, DataSourceError> {
  return prismaQueryToResult(async () => await client.findMany());
}

export function findOne(
  client: TodoPrismaClient,
  id: string,
): ResultAsync<TodoDataSourceDTO | null, DataSourceError> {
  return prismaQueryToResult(
    async () =>
      await client.findUnique({
        where: {
          id,
        },
      }),
  );
}

export function create(
  client: TodoPrismaClient,
  data: CreateTodoDTO,
): ResultAsync<TodoDataSourceDTO, DataSourceError> {
  return prismaQueryToResult(
    async () =>
      await client.create({
        data,
      }),
  );
}

export function update(
  client: TodoPrismaClient,
  id: string,
  data: UpdateTodoDTO,
): ResultAsync<TodoDataSourceDTO, DataSourceError> {
  return prismaQueryToResult(
    async () =>
      await client.update({
        where: {
          id,
        },
        data,
      }),
  );
}

export function remove(
  client: TodoPrismaClient,
  id: string,
): ResultAsync<TodoDataSourceDTO, DataSourceError> {
  return prismaQueryToResult(
    async () =>
      await client.delete({
        where: {
          id,
        },
      }),
  );
}

export function createPrismaTodoDataSource(
  client: TodoPrismaClient,
): TodoDataSource {
  return {
    findAll: () => findAll(client),
    findOne: (id: string) => findOne(client, id),
    create: (data: CreateTodoDTO) => create(client, data),
    update: (id: string, data: UpdateTodoDTO) => update(client, id, data),
    remove: (id: string) => remove(client, id),
  };
}
