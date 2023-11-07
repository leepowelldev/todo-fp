import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";

export function safeJsonParse<T>(value: string): E.Either<SyntaxError, T> {
  return E.tryCatch(
    () => JSON.parse(value),
    (error) => error as SyntaxError,
  );
}

export function tryJsonParse<T>(value: string): O.Option<T> {
  return O.tryCatch(() => JSON.parse(value));
}
