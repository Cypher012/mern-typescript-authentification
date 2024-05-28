import express from "express";
import { validateResource } from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";
import {
  createSessionHandler,
  refreshAccessTokenHandler,
} from "../controller/auth.controller";
import { requireUser } from "../middleware/requireUser";

const router = express.Router();

router.post(
  "/api/session",
  validateResource(createSessionSchema),
  createSessionHandler
);

router.post("/api/refresh", requireUser, refreshAccessTokenHandler);

export default router;
