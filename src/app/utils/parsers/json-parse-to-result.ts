import { Result } from "neverthrow";

export function jsonParseToResult<T>(value: unknown): Result<T, SyntaxError> {
  return Result.fromThrowable<(...args: ReadonlyArray<any>) => T, SyntaxError>(
    JSON.parse,
  )(value);
}
