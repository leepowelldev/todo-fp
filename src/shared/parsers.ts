import { type ParseParams, type z } from "zod";
import * as Either from "fp-ts/Either";
import * as Option from "fp-ts/Option";
import {
  CreateTodoDTOSchema,
  TodoReadonlySchema,
  TodoResponseDTOSchema,
  UpdateTodoDTOSchema,
} from "./schemas";

function zodParseToEither<T extends z.ZodType>(
  parser: T,
): (
  data: unknown,
  params?: Partial<z.ParseParams> | undefined,
) => Either.Either<
  z.ZodError<z.input<T>>,
  ReturnType<(typeof parser)["parse"]>
> {
  return Either.tryCatchK(parser.parse, (e) => e as z.ZodError<z.input<T>>);
}

function zodParseToOption<T extends z.ZodType>(
  parser: T,
): (
  data: unknown,
  params?: Partial<z.ParseParams> | undefined,
) => Option.Option<ReturnType<(typeof parser)["parse"]>> {
  return Option.tryCatchK(parser.parse);
}

/* -------------------------------------------------------------------------- */
/* Todo                                                                       */
/* -------------------------------------------------------------------------- */

//  Throws
export const parseTodo = TodoReadonlySchema.parse;

// Returns Either
export const safeParseTodo = zodParseToEither(TodoReadonlySchema);

// Returns Option
export const tryParseTodo = zodParseToOption(TodoReadonlySchema);

/* -------------------------------------------------------------------------- */
/* CreateTodoDTOSchema                                                        */
/* -------------------------------------------------------------------------- */

export const parseCreateTodoDTO = CreateTodoDTOSchema.parse;

export const safeParseCreateTodoDTO = zodParseToEither(CreateTodoDTOSchema);

export const tryParseCreateTodoDTO = zodParseToOption(CreateTodoDTOSchema);

/* -------------------------------------------------------------------------- */
/* UpdateTodoDTO                                                              */
/* -------------------------------------------------------------------------- */

export const parseUpdateTodoDTO = UpdateTodoDTOSchema.parse;

export const safeParseUpdateTodoDTO = zodParseToEither(UpdateTodoDTOSchema);

export const tryParseUpdateTodoDTO = zodParseToOption(UpdateTodoDTOSchema);

/* -------------------------------------------------------------------------- */
/* TodoResponseDTO                                                            */
/* -------------------------------------------------------------------------- */

export const parseTodoResponseDTO = TodoResponseDTOSchema.parse;
