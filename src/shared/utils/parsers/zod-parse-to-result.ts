import { Result } from "neverthrow";
import { type ZodError } from "zod";

export function zodParseToResult<T>(
  fn: (value: unknown) => T,
  value: unknown,
): Result<T, ZodError> {
  return Result.fromThrowable<typeof fn, ZodError>(fn)(value);
}
