import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { type Either, left, right } from "fp-ts/lib/Either";
import { type DataSourceError } from "../../../modules/todos/data-sources/todo.data-source";

export async function prismaQueryToResult<T>(
  query: Promise<T>,
): Promise<Either<DataSourceError, Awaited<T>>> {
  try {
    return right(await query);
  } catch (caught) {
    if (caught instanceof PrismaClientKnownRequestError) {
      // https://nestjs-prisma.dev/docs/exception-filter/
      switch (caught.code) {
        case "P2000": {
          return left("QUERY_ERROR" as const);
        }
        case "P2002": {
          return left("CONFLICT_ERROR" as const);
        }
        case "P2025": {
          return left("NOT_FOUND_ERROR" as const);
        }
      }
    }

    throw caught;
  }
}
