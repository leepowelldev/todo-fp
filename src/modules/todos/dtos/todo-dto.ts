export type TodoDTO = Readonly<{
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  completedAt: string | null;
}>;
