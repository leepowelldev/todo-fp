import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import { router } from "./routes";
import { bodyParserErrorHandler, globalErrorHandler } from "./error-handlers";
import { acceptsMiddleware, contentTypeMiddleware } from "./middleware";

const app = express();
const port = process.env.PORT ?? 9001;

app.use(helmet());
app.use(acceptsMiddleware);
app.use(contentTypeMiddleware);
app.use(bodyParser.json());
app.use(bodyParserErrorHandler);
app.use(router);
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}... 🚀`);
});
