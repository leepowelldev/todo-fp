import { type PrismaClient } from "@prisma/client";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { type CreateTodoDTO } from "../dtos/create-todo.dto";
import { type UpdateTodoDTO } from "../dtos/update-todo.dto";
import { type TodoDataSource, TodoDataSourceError } from "./todo.data-source";

type TodoPrismaClient = PrismaClient["todo"];

function mapError(message: string): (error: unknown) => TodoDataSourceError {
  return function (error: unknown) {
    let errorType: TodoDataSourceError["type"] = "UNKNOWN";

    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025": {
          errorType = "NOT_FOUND";
          break;
        }
        case "P2002": {
          errorType = "CONFLICT";
          break;
        }
        case "P2000": {
          errorType = "BAD_REQUEST";
          break;
        }
      }
    }

    return new TodoDataSourceError(errorType, message, {
      cause: error,
    });
  };
}

export function findAll(
  client: TodoPrismaClient,
): ReturnType<TodoDataSource["findAll"]> {
  return TE.tryCatch(
    async () => await client.findMany(),
    mapError("Failed to get todos"),
  );
}

export function findOne(
  client: TodoPrismaClient,
  id: string,
): ReturnType<TodoDataSource["findOne"]> {
  return pipe(
    TE.tryCatch(
      async () => await client.findUniqueOrThrow({ where: { id } }),
      mapError(`Failed to get todo with id ${id}`),
    ),
  );
}

export function create(
  client: TodoPrismaClient,
  data: CreateTodoDTO,
): ReturnType<TodoDataSource["create"]> {
  return TE.tryCatch(
    async () =>
      await client.create({
        data,
      }),
    mapError(`Failed to create todo with data ${JSON.stringify(data)}`),
  );
}

export function update(
  client: TodoPrismaClient,
  id: string,
  data: UpdateTodoDTO,
): ReturnType<TodoDataSource["update"]> {
  return pipe(
    TE.tryCatch(
      async () =>
        await client.update({
          where: {
            id,
          },
          data,
        }),
      mapError(
        `Failed to update todo with id ${id} and data ${JSON.stringify(data)}`,
      ),
    ),
  );
}

export function remove(
  client: TodoPrismaClient,
  id: string,
): ReturnType<TodoDataSource["remove"]> {
  return pipe(
    TE.tryCatch(
      async () =>
        await client.delete({
          where: {
            id,
          },
        }),
      mapError(`Failed to delete todo with id ${id}`),
    ),
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
