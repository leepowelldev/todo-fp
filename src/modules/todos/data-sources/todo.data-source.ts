import { type PrismaClient } from "@prisma/client";
import { type Either } from "fp-ts/lib/Either";
import { type TodoDO } from "../dos/todo-do";
import { prismaQueryToResult } from "../../../infra/database/utils/prisma-query-to-either";

export type DataSourceError =
  | "NOT_FOUND_ERROR"
  | "CONFLICT_ERROR"
  | "QUERY_ERROR";

export type TodoDataSource = {
  findAll(): Promise<Either<DataSourceError, ReadonlyArray<TodoDO>>>;
  findOne(id: string): Promise<Either<DataSourceError, TodoDO | null>>;
  // create(): Promise<TodoDO>;
  // update(): Promise<TodoDO>;
  // delete(): Promise<TodoDO>;
};

type TodoPrismaClient = PrismaClient["todo"];

export async function findAll(
  client: TodoPrismaClient,
): Promise<Either<DataSourceError, ReadonlyArray<TodoDO>>> {
  return await prismaQueryToResult(client.findMany());
}

export async function findOne(
  client: TodoPrismaClient,
  id: string,
): Promise<Either<DataSourceError, TodoDO | null>> {
  return await prismaQueryToResult(
    client.findUnique({
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
    findAll: async () => await findAll(client),
    findOne: async (id: string) => await findOne(client, id),
  };
}
