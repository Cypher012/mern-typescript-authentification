// express.d.ts
import * as express from "express";
import User from "./src/model/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: User; // You can replace `any` with a more specific type if needed
    }
  }
}
