import { z } from "zod";
import { anyNonNil as isUUId } from "is-uuid";
import { type Todo } from "../entities/todo.entity";
import { zodParseToResult } from "../../../app/utils/parsers/zod-parse-to-result";

const TodoSchema = z
  .object({
    id: z
      .string()
      .trim()
      .refine((value) => isUUId(value), {
        message: "Invalid id",
        path: ["id"],
      }),
    title: z.string().trim().min(1).max(50),
    description: z.string().trim().min(1).max(150).nullable(),
    createdAt: z.preprocess((value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }, z.string().trim().datetime()),
    completedAt: z
      .preprocess((value) => {
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      }, z.string().trim().datetime())
      .nullable(),
  })
  .readonly() satisfies z.ZodType<Todo, any, any>;

export const parseTodo = zodParseToResult(TodoSchema.parse);
