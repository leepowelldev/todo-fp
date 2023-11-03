export type ResultError<T extends string, E = unknown> = { name: T; error?: E };

export function createResultError<T extends string, E = unknown>(
  name: T,
  error?: E,
): ResultError<T, E> {
  return {
    name,
    error,
  };
}

export function isResultError(value: unknown): value is ResultError<any, any> {
  return (
    value !== null &&
    typeof value === "object" &&
    "name" in value &&
    "error" in value
  );
}
