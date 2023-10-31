export type UpdateTodoDTO = Readonly<{
  title?: string;
  description?: string | null;
  completedAt?: string | null;
}>;
