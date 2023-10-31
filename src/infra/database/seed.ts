import { client } from "./client";

// Must use a top level await to avoid a Bun issue
// https://github.com/prisma/prisma/issues/21324#issuecomment-1751945478
try {
  await client.todo.create({
    data: {
      id: "cf13b3f7-b7ae-4a1a-92f4-4a2c85aff591",
      title: "Collect shopping",
      description: "Pick up from Sainsburys",
    },
  });
} catch (error) {
  console.log(error);
}
