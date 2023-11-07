import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";

export function safeJsonStringify(
  value: unknown,
): E.Either<SyntaxError, string> {
  return E.tryCatch(
    () => JSON.stringify(value),
    (error) => error as SyntaxError,
  );
}

export function tryJsonStringify(value: unknown): O.Option<string> {
  return O.tryCatch(() => JSON.stringify(value));
}
