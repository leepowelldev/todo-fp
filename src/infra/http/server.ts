import express from "express";

const app = express();
const port = process.env.PORT ?? 9001;

app.use("/health-check", (_, response) => response.sendStatus(200));

app.use("/", (_, response) => response.send("Hello."));

app.use("*", (_, response) => response.sendStatus(404));

app.listen(port, () => {
  console.log(`Listening on port ${port}... 🚀`);
});
