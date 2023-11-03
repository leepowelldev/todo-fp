export type CreateTodoDTO = Readonly<{
  title: string;
  description?: string | null;
  completedAt?: string | null;
}>;
