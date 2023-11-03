import { expect, it } from "bun:test";
import { type Err, type Ok } from "neverthrow";
import { jsonParseToResult } from "../json-parse-to-result";

it("should return a result value when successfully parsed", () => {
  const data = { foo: "bar" };
  const dataString = JSON.stringify(data);
  const result = jsonParseToResult(dataString);

  expect((result as Ok<any, never>).value).toEqual(data);
});

it("should return a error value when unsuccessfully parsed", () => {
  const data = '{ "foo": "bar", }';
  const result = jsonParseToResult(data);

  expect((result as Err<never, any>).error).toBeInstanceOf(SyntaxError);
});
