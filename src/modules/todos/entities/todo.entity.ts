import { type Result, err } from "neverthrow";
import { type ZodError } from "zod";
import { parseTodo } from "../utils/parsers";

export type Todo = Readonly<{
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  completedAt: string | null;
}>;

export function create(data: {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date | string;
  completedAt: Date | string | null;
}): Result<Todo, ZodError> {
  return parseTodo(data);
}

export function setTitle(todo: Todo, title: string): Result<Todo, ZodError> {
  return create({
    ...todo,
    title,
  });
}

export function setDescription(
  todo: Todo,
  description: string | null,
): Result<Todo, ZodError> {
  return create({
    ...todo,
    description,
  });
}

export function setCompletedAt(
  todo: Todo,
  completedAt: string | null,
): Result<Todo, "ALREADY_COMPLETED" | ZodError> {
  if (typeof completedAt === "string" && todo.completedAt !== null) {
    // Error - todo is already set as completed
    return err("ALREADY_COMPLETED" as const);
  }

  return create({
    ...todo,
    completedAt,
  });
}

export function toggleCompleted(todo: Todo): Result<Todo, ZodError> {
  const completedAt =
    todo.completedAt === null ? new Date().toISOString() : null;

  return create({
    ...todo,
    completedAt,
  });
}
