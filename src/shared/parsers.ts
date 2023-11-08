import { type ZodError, type ParseParams, type z } from "zod";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import {
  CreateTodoDTOSchema,
  TodoReadonlySchema,
  TodoResponseDTOSchema,
  UpdateTodoDTOSchema,
} from "./schemas";

export class ParseError extends Error {
  readonly name = "ParseError";
  readonly cause: ZodError | undefined;
  constructor(
    message?: string,
    options?: {
      cause?: ZodError;
    },
  ) {
    super(message, options);
    this.cause = options?.cause;
  }
}

function zodParseToEither<T extends z.ZodType>(
  parser: T,
  message?: string,
): (
  data: unknown,
  params?: Partial<z.ParseParams> | undefined,
) => E.Either<ParseError, ReturnType<(typeof parser)["parse"]>> {
  return E.tryCatchK(
    parser.parse,
    (error) =>
      new ParseError(message ?? "Parse error", { cause: error as ZodError }),
  );
}

function zodParseToOption<T extends z.ZodType>(
  parser: T,
): (
  data: unknown,
  params?: Partial<z.ParseParams> | undefined,
) => O.Option<ReturnType<(typeof parser)["parse"]>> {
  return O.tryCatchK(parser.parse);
}

/* -------------------------------------------------------------------------- */
/* Todo                                                                       */
/* -------------------------------------------------------------------------- */

//  Throws
export const parseTodo = TodoReadonlySchema.parse;

// Returns Either
export const safeParseTodo = zodParseToEither(
  TodoReadonlySchema,
  "Parsing Todo error",
);

// Returns Option
export const tryParseTodo = zodParseToOption(TodoReadonlySchema);

/* -------------------------------------------------------------------------- */
/* CreateTodoDTOSchema                                                        */
/* -------------------------------------------------------------------------- */

export const parseCreateTodoDTO = CreateTodoDTOSchema.parse;

export const safeParseCreateTodoDTO = zodParseToEither(
  CreateTodoDTOSchema,
  "Parsing CreateTodoDTO error",
);

export const tryParseCreateTodoDTO = zodParseToOption(CreateTodoDTOSchema);

/* -------------------------------------------------------------------------- */
/* UpdateTodoDTO                                                              */
/* -------------------------------------------------------------------------- */

export const parseUpdateTodoDTO = UpdateTodoDTOSchema.parse;

export const safeParseUpdateTodoDTO = zodParseToEither(
  UpdateTodoDTOSchema,
  "Parsing UpdateTodoDTO error",
);

export const tryParseUpdateTodoDTO = zodParseToOption(UpdateTodoDTOSchema);

/* -------------------------------------------------------------------------- */
/* TodoResponseDTO                                                            */
/* -------------------------------------------------------------------------- */

export const parseTodoResponseDTO = TodoResponseDTOSchema.parse;

export const safeParseTodoResponseDTO = zodParseToEither(
  TodoResponseDTOSchema,
  "Parsing TodoResponseDTO error",
);

export const tryParseTodoResponseDTO = zodParseToOption(TodoResponseDTOSchema);
