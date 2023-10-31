import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const t = await client.todo.delete({
  where: {
    id: "dfdf",
  },
});
