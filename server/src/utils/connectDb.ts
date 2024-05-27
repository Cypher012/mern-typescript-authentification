import mongoose from "mongoose";
import config from "config";
import asyncHandler from "express-async-handler";
import { log } from "./logger";

export const connectDb = async () => {
  try {
    const dbUri = config.get<string>("dbUri");
    const connect = await mongoose.connect(dbUri);
    log.info("Connected to DB");
  } catch (error) {
    process.exit(1);
  }
};
