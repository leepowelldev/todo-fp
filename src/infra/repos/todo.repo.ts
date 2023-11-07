import { pipe } from "fp-ts/function";
import * as TaskEither from "fp-ts/TaskEither";
import * as Either from "fp-ts/Either";
import { type TodoDataSource } from "../data-sources/todo.data-source";
import { type Todo } from "../../domain/entities/todo.entity";
import { type CreateTodoDTO } from "../dtos/create-todo.dto";
import { safeParseTodo } from "../../shared/parsers";
import {
  TodoRepositoryError,
  type TodoRepository,
} from "../../domain/repos/todo.repo";
import { type UpdateTodoDTO } from "../dtos/update-todo.dto";
import { type TodoDataSourceDTO } from "../dtos/todo-data-source.dto";

function parseTodoAndMapError(
  todoDTO: TodoDataSourceDTO,
): Either.Either<TodoRepositoryError, Todo> {
  return pipe(
    todoDTO,
    safeParseTodo,
    Either.mapLeft(
      (error) =>
        new TodoRepositoryError("Error parsing todo data", "PARSE_ERROR", {
          cause: error,
        }),
    ),
  );
}

export function findAll(
  dataSource: TodoDataSource,
): ReturnType<TodoRepository["findAll"]> {
  return pipe(
    dataSource.findAll(),
    TaskEither.flatMapEither((todoDTOs) =>
      pipe(
        todoDTOs.map((todoDTO) => safeParseTodo(todoDTO)),
        Either.sequenceArray,
        Either.mapLeft(
          (error) =>
            new TodoRepositoryError("Error parsing todo data", "PARSE_ERROR", {
              cause: error,
            }),
        ),
      ),
    ),
  );
}

// export function findOne(
//   dataSource: TodoDataSource,
//   id: string,
// ): ReturnType<TodoRepository["findOne"]> {
//   return pipe(
//     dataSource.findOne(id),
//     TaskEither.flatMapEither(
//       flow(
//         Option.match(
//           () => Either.right(Option.none),
//           flow(
//             safeParseTodo,
//             Either.map(Option.some),
//             Either.mapLeft(
//               (error) =>
//                 new TodoRepositoryError("Error parsing todo data", {
//                   cause: error,
//                 }),
//             ),
//           ),
//         ),
//       ),
//     ),
//   );
// }

export function findOne(
  dataSource: TodoDataSource,
  id: string,
): ReturnType<TodoRepository["findOne"]> {
  return pipe(
    dataSource.findOne(id),
    TaskEither.flatMapEither(parseTodoAndMapError),
  );
}

export function create(
  dataSource: TodoDataSource,
  data: CreateTodoDTO,
): ReturnType<TodoRepository["create"]> {
  return pipe(
    dataSource.create(data),
    TaskEither.flatMapEither(parseTodoAndMapError),
  );
}

export function update(
  dataSource: TodoDataSource,
  id: string,
  data: UpdateTodoDTO,
): ReturnType<TodoRepository["update"]> {
  return pipe(
    dataSource.update(id, data),
    TaskEither.flatMapEither(parseTodoAndMapError),
  );
}

export function remove(
  dataSource: TodoDataSource,
  id: string,
): ReturnType<TodoRepository["remove"]> {
  return pipe(
    dataSource.remove(id),
    TaskEither.flatMapEither(parseTodoAndMapError),
  );
}

export function createTodoRepository(
  dataSource: TodoDataSource,
): TodoRepository {
  return {
    findAll: () => findAll(dataSource),
    findOne: (id: string) => findOne(dataSource, id),
    create: (data: CreateTodoDTO) => create(dataSource, data),
    update: (id: string, data: UpdateTodoDTO) => update(dataSource, id, data),
    remove: (id: string) => remove(dataSource, id),
  };
}
