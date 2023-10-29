import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";
import { ResultAsync } from "neverthrow";
import { type DataSourceError } from "../../../modules/todos/data-sources/todo.data-source";

export function prismaQueryToResult<T>(
  fn: () => Promise<T>,
): ResultAsync<T, DataSourceError> {
  return ResultAsync.fromPromise<T, DataSourceError>(fn(), (caught) => {
    if (caught instanceof PrismaClientKnownRequestError) {
      switch (caught.code) {
        case "P2000": {
          return { type: "DATA_SOURCE_QUERY_ERROR", error: caught };
        }
        case "P2002": {
          return { type: "DATA_SOURCE_CONFLICT_ERROR", error: caught };
        }
        case "P2025": {
          return { type: "DATA_SOURCE_NOT_FOUND_ERROR", error: caught };
        }
      }
    }

    if (caught instanceof PrismaClientInitializationError) {
      switch (caught.errorCode) {
        case "P1000":
        case "P1010": {
          return { type: "DATA_SOURCE_AUTHORIZATION_ERROR", error: caught };
        }
        case "P1001":
        case "P1003":
        case "P1017": {
          return { type: "DATA_SOURCE_UNAVAILABLE_ERROR", error: caught };
        }
        case "P1002":
        case "P1008": {
          return { type: "DATA_SOURCE_TIMEOUT_ERROR", error: caught };
        }
        case "P1011": {
          return { type: "DATA_SOURCE_NETWORK_ERROR", error: caught };
        }
      }
    }

    return {
      type: "DATA_SOURCE_UNKNOWN_ERROR",
      error: Error(undefined, { cause: caught }),
    };
  });
}
