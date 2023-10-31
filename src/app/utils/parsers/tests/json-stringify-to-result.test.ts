import { expect, it } from "bun:test";
import { type Err, type Ok } from "neverthrow";
import { jsonStringifyToResult } from "../json-stringify-to-result";

it("should return a result value when successfully stringified", () => {
  const data = { foo: "bar" };
  const dataString = JSON.stringify(data);
  const result = jsonStringifyToResult(data);

  expect((result as Ok<any, never>).value).toEqual(dataString);
});

it("should return a error value when unsuccessfully stringified", () => {
  const data: Record<string, any> = {};
  data.foo = data;
  const result = jsonStringifyToResult(data);

  expect((result as Err<never, any>).error).toBeInstanceOf(TypeError);
});
