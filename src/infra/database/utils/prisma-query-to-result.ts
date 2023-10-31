import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ResultAsync } from "neverthrow";
import { type DataSourceError } from "../../../modules/todos/data-sources/todo.data-source";

export function prismaQueryToResult<T>(
  fn: () => Promise<T>,
): ResultAsync<T, DataSourceError> {
  return ResultAsync.fromPromise<T, DataSourceError>(fn(), (caught) => {
    // https://nestjs-prisma.dev/docs/exception-filter/
    if (caught instanceof PrismaClientKnownRequestError) {
      switch (caught.code) {
        case "P2000": {
          return "DATA_SOURCE_QUERY_ERROR";
        }
        case "P2002": {
          return "DATA_SOURCE_CONFLICT_ERROR";
        }
        case "P2025": {
          return "DATA_SOURCE_NOT_FOUND_ERROR";
        }
      }
    }

    throw caught;
  });
}
