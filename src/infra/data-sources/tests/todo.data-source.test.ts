import { describe, beforeEach, expect, it } from "bun:test";
import {
  createPrismaTodoDataSource,
  findOne,
  findAll,
  create,
  update,
  remove,
} from "../todo.data-source";
import { client } from "../../database/client";

const data = [
  {
    id: "1",
    title: "Collect laundry",
  },
  {
    id: "2",
    title: "Send parcel",
  },
];

beforeEach(async () => {
  await client.todo.deleteMany();
});

describe("createPrismaTodoDataSource", () => {
  it("should create a data source", () => {
    const dataSource = createPrismaTodoDataSource(client.todo);

    expect(dataSource).toMatchObject({
      findAll: expect.any(Function),
      findOne: expect.any(Function),
      create: expect.any(Function),
      update: expect.any(Function),
      remove: expect.any(Function),
    });
  });

  describe("findAll", () => {
    it("should find all todos", async () => {
      await client.todo.createMany({ data });
      const dataSource = createPrismaTodoDataSource(client.todo);

      const result = await dataSource.findAll();

      // TODO Wait for Bun to support .arrayContaining
      expect((result as Ok<any, never>).value).toBeArrayOfSize(2);
    });
  });

  describe("findOne", () => {
    it("should find a todo by id", async () => {
      await client.todo.createMany({ data });
      const dataSource = createPrismaTodoDataSource(client.todo);

      const result = await dataSource.findOne("1");

      expect((result as Ok<any, never>).value).toMatchObject({
        ...data[0],
        completedAt: null,
        description: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe("create", () => {
    it("should create a todo", async () => {
      await client.todo.createMany({ data });
      const dataSource = createPrismaTodoDataSource(client.todo);

      const title = "Test todo";
      const description = "Test description";

      const result = await dataSource.create({
        title,
        description,
      });

      expect((result as Ok<any, never>).value).toMatchObject({
        id: expect.any(String),
        title,
        description,
        completedAt: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe("update", () => {
    it("should update a todo", async () => {
      await client.todo.createMany({ data });
      const dataSource = createPrismaTodoDataSource(client.todo);

      const title = "Test todo";
      const description = "Test description";
      const completedAt = "2023-10-31T11:01:20.937Z";

      const result = await dataSource.update("1", {
        title,
        description,
        completedAt,
      });

      expect((result as Ok<any, never>).value).toMatchObject({
        ...data[0],
        title,
        description,
        completedAt: new Date(completedAt),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe("remove", () => {
    it("should remove a todo", async () => {
      await client.todo.createMany({ data });
      const dataSource = createPrismaTodoDataSource(client.todo);

      const result = await dataSource.remove("1");

      expect((result as Ok<any, never>).value).toMatchObject({
        ...data[0],
        completedAt: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(await client.todo.findUnique({ where: { id: "1" } })).toBeNull();
    });
  });
});

describe("findAll", () => {
  it("should find all todos", async () => {
    await client.todo.createMany({ data });

    const result = await findAll(client.todo);

    // TODO Wait for Bun to support .arrayContaining
    expect((result as Ok<any, never>).value).toBeArrayOfSize(2);
  });
});

describe("findOne", () => {
  it("should find a todo by id", async () => {
    await client.todo.createMany({ data });

    const result = await findOne(client.todo, "1");

    expect((result as Ok<any, never>).value).toMatchObject({
      ...data[0],
      completedAt: null,
      description: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});

describe("create", () => {
  it("should create a todo", async () => {
    await client.todo.createMany({ data });

    const title = "Test todo";
    const description = "Test description";

    const result = await create(client.todo, {
      title,
      description,
    });

    expect((result as Ok<any, never>).value).toMatchObject({
      id: expect.any(String),
      title,
      description,
      completedAt: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});

describe("update", () => {
  it("should update a todo", async () => {
    await client.todo.createMany({ data });

    const title = "Test todo";
    const description = "Test description";
    const completedAt = "2023-10-31T11:01:20.937Z";

    const result = await update(client.todo, "1", {
      title,
      description,
      completedAt,
    });

    expect((result as Ok<any, never>).value).toMatchObject({
      ...data[0],
      title,
      description,
      completedAt: new Date(completedAt),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});

describe("remove", () => {
  it("should remove a todo", async () => {
    await client.todo.createMany({ data });

    const result = await remove(client.todo, "1");

    expect((result as Ok<any, never>).value).toMatchObject({
      ...data[0],
      completedAt: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(await client.todo.findUnique({ where: { id: "1" } })).toBeNull();
  });
});
