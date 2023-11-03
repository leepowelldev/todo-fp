import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ResultAsync } from "neverthrow";
import { type DataSourceError } from "../../data-sources/todo.data-source";
import { createResultError } from "../../../shared/errors/result-error";

export function prismaQueryToResult<T>(
  fn: () => Promise<T>,
): ResultAsync<T, DataSourceError> {
  return ResultAsync.fromPromise<T, DataSourceError>(fn(), (error) => {
    // https://nestjs-prisma.dev/docs/exception-filter/
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2000
        case "P2000": {
          return createResultError("DATA_SOURCE_QUERY_ERROR", error);
        }
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
        case "P2002": {
          return createResultError("DATA_SOURCE_CONFLICT_ERROR", error);
        }
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        case "P2025": {
          return createResultError("DATA_SOURCE_NOT_FOUND_ERROR", error);
        }
      }
    }

    throw error;
  });
}
