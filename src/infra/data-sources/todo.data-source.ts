import { type PrismaClient } from "@prisma/client";
import { pipe } from "fp-ts/function";
import * as TaskEither from "fp-ts/TaskEither";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { type CreateTodoDTO } from "../dtos/create-todo.dto";
import { type TodoDataSourceDTO } from "../dtos/todo-data-source.dto";
import { type UpdateTodoDTO } from "../dtos/update-todo.dto";

export class TodoDataSourceError extends Error {
  readonly name = "DataSourceError";
  readonly type: "NOT_FOUND" | "CONFLICT" | "BAD_REQUEST" | "UNKNOWN";
  constructor(
    message: string,
    type: TodoDataSourceError["type"],
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.type = type;
  }
}

export type TodoDataSource = {
  findAll(): TaskEither.TaskEither<
    TodoDataSourceError,
    ReadonlyArray<TodoDataSourceDTO>
  >;
  findOne(
    id: string,
  ): TaskEither.TaskEither<TodoDataSourceError, TodoDataSourceDTO>;
  create(
    data: CreateTodoDTO,
  ): TaskEither.TaskEither<TodoDataSourceError, TodoDataSourceDTO>;
  update(
    id: string,
    data: UpdateTodoDTO,
  ): TaskEither.TaskEither<TodoDataSourceError, TodoDataSourceDTO>;
  remove(
    id: string,
  ): TaskEither.TaskEither<TodoDataSourceError, TodoDataSourceDTO>;
};

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

    return new TodoDataSourceError(message, errorType, {
      cause: error,
    });
  };
}

export function findAll(
  client: TodoPrismaClient,
): ReturnType<TodoDataSource["findAll"]> {
  return TaskEither.tryCatch(
    async () => await client.findMany(),
    mapError("Failed to get todos"),
  );
}

// export function findOne(
//   client: TodoPrismaClient,
//   id: string,
// ): ReturnType<TodoDataSource["findOne"]> {
//   return pipe(
//     TaskEither.tryCatch(
//       async () => await client.findUnique({ where: { id } }),
//       (error) => new TodoDataSourceError("findOne failed", { cause: error }),
//     ),
//     TaskEither.map(Option.fromNullable),
//   );
// }

export function findOne(
  client: TodoPrismaClient,
  id: string,
): ReturnType<TodoDataSource["findOne"]> {
  return pipe(
    TaskEither.tryCatch(
      async () => await client.findUniqueOrThrow({ where: { id } }),
      mapError(`Failed to get todo with id ${id}`),
    ),
  );
}

export function create(
  client: TodoPrismaClient,
  data: CreateTodoDTO,
): ReturnType<TodoDataSource["create"]> {
  return TaskEither.tryCatch(
    async () =>
      await client.create({
        data,
      }),
    mapError("Failed to create todo"),
  );
}

// export function update(
//   client: TodoPrismaClient,
//   id: string,
//   data: UpdateTodoDTO,
// ): ReturnType<TodoDataSource["update"]> {
//   return pipe(
//     TaskEither.tryCatch(
//       async () =>
//         await client.update({
//           where: {
//             id,
//           },
//           data,
//         }),
//       identity,
//     ),
//     TaskEither.map(Option.some),
//     TaskEither.match(
//       (error) => {
//         if (
//           error instanceof PrismaClientKnownRequestError &&
//           error.code === "P2025"
//         ) {
//           return TaskEither.right(Option.none);
//         }
//         return TaskEither.left(
//           new TodoDataSourceError(`Failed to update todo with id ${id}`, {
//             cause: error,
//           }),
//         );
//       },
//       (right) => TaskEither.right(right),
//     ),
//     TaskEither.fromTask,
//     TaskEither.flatten,
//   );
// }

export function update(
  client: TodoPrismaClient,
  id: string,
  data: UpdateTodoDTO,
): ReturnType<TodoDataSource["update"]> {
  return pipe(
    TaskEither.tryCatch(
      async () =>
        await client.update({
          where: {
            id,
          },
          data,
        }),
      mapError(`Failed to update todo with id ${id}`),
    ),
  );
}

export function remove(
  client: TodoPrismaClient,
  id: string,
): ReturnType<TodoDataSource["remove"]> {
  return pipe(
    TaskEither.tryCatch(
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
