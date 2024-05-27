import dotenv from "dotenv";
import express from "express";
import config from "config";
import { connectDb } from "./utils/connectDb";
import { log } from "./utils/logger";
import router from "./routes/index";
import { ErrorHandler } from "./middleware/globalErrorHandler";

dotenv.config();

const app = express();
app.use(express.json());
app.use(router);
const port = config.get("port");

app.use(ErrorHandler);

app.listen(port, () => {
  log.info(`App started at http://localhost:${port}`);
  connectDb();
});
