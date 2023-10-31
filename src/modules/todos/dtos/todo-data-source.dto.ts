import { type Todo } from "@prisma/client";

// Shape of a Todo we can expect back from our data source
export type TodoDataSourceDTO = Readonly<Todo>;
