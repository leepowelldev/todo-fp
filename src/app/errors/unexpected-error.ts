export class UnexpectedError extends Error {
  readonly name = "UnexpectedError";
  constructor(options?: ErrorOptions) {
    super("Unexpected error", options);
  }
}
