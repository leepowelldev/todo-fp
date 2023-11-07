import { type PrismaClient } from "@prisma/client";
import * as TaskEither from "fp-ts/TaskEither";
import * as Option from "fp-ts/Option";
import { type CreateTodoDTO } from "../dtos/create-todo.dto";
import { type TodoDataSourceDTO } from "../dtos/todo-data-source.dto";
import { type UpdateTodoDTO } from "../dtos/update-todo.dto";

export class DataSourceError extends Error {
  readonly name = "DataSourceError";
}

export type TodoDataSource = {
  findAll(): TaskEither.TaskEither<
    DataSourceError,
    ReadonlyArray<TodoDataSourceDTO>
  >;
  findOne(
    id: string,
  ): TaskEither.TaskEither<Error, Option.Option<TodoDataSourceDTO>>;
  create(data: CreateTodoDTO): TaskEither.TaskEither<Error, TodoDataSourceDTO>;
  update(
    id: string,
    data: UpdateTodoDTO,
  ): TaskEither.TaskEither<Error, TodoDataSourceDTO>;
  remove(id: string): TaskEither.TaskEither<Error, TodoDataSourceDTO>;
};

type TodoPrismaClient = PrismaClient["todo"];

export function findAll(
  client: TodoPrismaClient,
): TaskEither.TaskEither<DataSourceError, ReadonlyArray<TodoDataSourceDTO>> {
  return TaskEither.tryCatch(
    async () => await client.findMany(),
    (error) => new DataSourceError("findAll failed", { cause: error }),
  );
}

export function findOne(
  client: TodoPrismaClient,
  id: string,
): TaskEither.TaskEither<DataSourceError, Option.Option<TodoDataSourceDTO>> {
  return TaskEither.tryCatch(
    async () =>
      Option.fromNullable(
        await client.findUnique({
          where: {
            id,
          },
        }),
      ),
    (error) => new DataSourceError("findOne failed", { cause: error }),
  );
}

export function create(
  client: TodoPrismaClient,
  data: CreateTodoDTO,
): TaskEither.TaskEither<DataSourceError, TodoDataSourceDTO> {
  return TaskEither.tryCatch(
    async () =>
      await client.create({
        data,
      }),
    (error) => new DataSourceError("create failed", { cause: error }),
  );
}

export function update(
  client: TodoPrismaClient,
  id: string,
  data: UpdateTodoDTO,
): TaskEither.TaskEither<DataSourceError, TodoDataSourceDTO> {
  return TaskEither.tryCatch(
    async () =>
      await client.update({
        where: {
          id,
        },
        data,
      }),
    (error) => new DataSourceError("update failed", { cause: error }),
  );
}

export function remove(
  client: TodoPrismaClient,
  id: string,
): TaskEither.TaskEither<DataSourceError, TodoDataSourceDTO> {
  return TaskEither.tryCatch(
    async () =>
      await client.delete({
        where: {
          id,
        },
      }),
    (error) => new DataSourceError("remove failed", { cause: error }),
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
