import {
  CreateTodoDTOSchema,
  TodoReadonlySchema,
  UpdateTodoDTOSchema,
} from "./schemas";

export const parseTodo = TodoReadonlySchema.parse;

export const parseCreateTodoDTO = CreateTodoDTOSchema.parse;

export const parseUpdateTodoDTO = UpdateTodoDTOSchema.parse;
