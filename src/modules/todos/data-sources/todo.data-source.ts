import { type PrismaClient } from "@prisma/client";
import { type ResultAsync } from "neverthrow";
import { type TodoDO } from "../dos/todo-do";
import { prismaQueryToResult } from "../../../infra/database/utils/prisma-query-to-result";

export type DataSourceError =
  | { type: "DATA_SOURCE_NOT_FOUND_ERROR"; error?: Error }
  | { type: "DATA_SOURCE_QUERY_ERROR"; error?: Error }
  | { type: "DATA_SOURCE_CONFLICT_ERROR"; error?: Error }
  | { type: "DATA_SOURCE_AUTHORIZATION_ERROR"; error?: Error }
  | { type: "DATA_SOURCE_UNAVAILABLE_ERROR"; error?: Error }
  | { type: "DATA_SOURCE_TIMEOUT_ERROR"; error?: Error }
  | { type: "DATA_SOURCE_NETWORK_ERROR"; error?: Error }
  | { type: "DATA_SOURCE_UNKNOWN_ERROR"; error?: Error };

export type TodoDataSource = {
  findAll(): ResultAsync<ReadonlyArray<TodoDO>, DataSourceError>;
  findOne(id: string): ResultAsync<TodoDO | null, DataSourceError>;
  // create(): Promise<TodoDO>;
  // update(): Promise<TodoDO>;
  // delete(): Promise<TodoDO>;
};

type TodoPrismaClient = PrismaClient["todo"];

export function findAll(
  client: TodoPrismaClient,
): ResultAsync<ReadonlyArray<TodoDO>, DataSourceError> {
  return prismaQueryToResult(async () => await client.findMany());
}

export function findOne(
  client: TodoPrismaClient,
  id: string,
): ResultAsync<TodoDO | null, DataSourceError> {
  return prismaQueryToResult(
    async () =>
      await client.findUnique({
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
  };
}
