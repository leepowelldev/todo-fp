import { expect, it } from "bun:test";
import { ZodError, z } from "zod";
import { type Err, type Ok } from "neverthrow";
import { zodParseToResult } from "../zod-parse-to-result";

it("should return a result value when successfully parsed", () => {
  const data = { foo: "bar" };
  const Schema = z.object({
    foo: z.string(),
  });
  const result = zodParseToResult(Schema.parse, data);

  expect((result as Ok<any, never>).value).toEqual(data);
});

it("should return a error value when unsuccessfully parsed", () => {
  const data = { bar: "foo" };
  const Schema = z.object({
    foo: z.string(),
  });
  const result = zodParseToResult(Schema.parse, data);

  expect((result as Err<never, any>).error).toBeInstanceOf(ZodError);
});
