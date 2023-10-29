import { type Either, left, right } from "fp-ts/lib/Either";
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
}): Todo {
  return parseTodo(data);
}

export function setTitle(todo: Todo, title: string): Todo {
  return create({
    ...todo,
    title,
  });
}

export function setDescription(todo: Todo, description: string | null): Todo {
  return create({
    ...todo,
    description,
  });
}

export function setCompletedAt(
  todo: Todo,
  completedAt: string | null,
): Either<"ALREADY_COMPLETED", Todo> {
  if (typeof completedAt === "string" && todo.completedAt !== null) {
    // Error - todo is already set as completed
    return left("ALREADY_COMPLETED" as const);
  }

  return right(
    create({
      ...todo,
      completedAt,
    }),
  );
}

export function toggleCompleted(todo: Todo): Todo {
  const completedAt =
    todo.completedAt === null ? new Date().toISOString() : null;

  return create({
    ...todo,
    completedAt,
  });
}
