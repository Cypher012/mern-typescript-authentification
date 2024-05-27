import logger from "pino";
import dayjs from "dayjs";
import config from "config";
import { timeStamp } from "console";

const level = config.get<string>("logLevel");

export const log = logger({
  transport: {
    target: "pino-pretty",
  },
  level,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});
