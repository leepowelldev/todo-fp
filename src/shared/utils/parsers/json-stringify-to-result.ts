import { Result } from "neverthrow";

export function jsonStringifyToResult(
  value: unknown,
): Result<string, SyntaxError> {
  return Result.fromThrowable<
    (...args: ReadonlyArray<any>) => string,
    SyntaxError
  >(JSON.stringify)(value);
}
