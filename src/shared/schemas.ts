import { z } from "zod";
import { type Todo } from "../domain/entities/todo.entity";
import { type CreateTodoDTO } from "../infra/dtos/create-todo.dto";
import { type UpdateTodoDTO } from "../infra/dtos/update-todo.dto";

export const TodoSchema = z.object({
  id: z.string().trim().uuid(),
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
}) satisfies z.ZodType<Todo, any, any>;

export const TodoReadonlySchema = TodoSchema.readonly();

export const CreateTodoDTOSchema = z
  .object({
    title: TodoSchema.shape.title,
    description: TodoSchema.shape.description.optional(),
    completedAt: TodoSchema.shape.completedAt.optional(),
  })
  .readonly() satisfies z.ZodType<CreateTodoDTO, any, any>;

export const UpdateTodoDTOSchema = z
  .object({
    title: TodoSchema.shape.title.optional(),
    description: TodoSchema.shape.description.optional(),
    completedAt: TodoSchema.shape.completedAt.optional(),
  })
  .readonly() satisfies z.ZodType<UpdateTodoDTO, any, any>;
