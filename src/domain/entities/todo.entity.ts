import { parseTodo } from "../../shared/parsers";

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
  return {
    ...todo,
    title,
  };
}

export function setDescription(todo: Todo, description: string | null): Todo {
  return {
    ...todo,
    description,
  };
}

export function setCompleted(todo: Todo): Todo {
  if (isCompleted(todo)) {
    return todo;
  }
  return {
    ...todo,
    completedAt: new Date().toISOString(),
  };
}

export function setNotCompleted(todo: Todo): Todo {
  if (!isCompleted(todo)) {
    return todo;
  }
  return {
    ...todo,
    completedAt: null,
  };
}

export function toggleCompleted(todo: Todo): Todo {
  if (todo.completedAt === null) {
    return setCompleted(todo);
  }
  return setNotCompleted(todo);
}

export function isCompleted(todo: Todo): boolean {
  return todo.completedAt !== null;
}
