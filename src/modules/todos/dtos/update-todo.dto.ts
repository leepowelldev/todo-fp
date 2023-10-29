export type UpdateTodoDIO = Readonly<{
  title?: string;
  description?: string | null;
  completedAt?: string | null;
}>;
