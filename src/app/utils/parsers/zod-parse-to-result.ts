import { Result } from "neverthrow";
import { type ZodError } from "zod";

export type ZodParseError = { type: "PARSE_ERROR"; error: ZodError };

export function zodParseToResult<T>(
  fn: (value: unknown) => T,
): (value: unknown) => Result<T, ZodParseError> {
  return (value: unknown): Result<T, ZodParseError> =>
    Result.fromThrowable<typeof fn, ZodError>(fn)(value).mapErr((error) => {
      return {
        type: "PARSE_ERROR" as const,
        error,
      };
    });
}
