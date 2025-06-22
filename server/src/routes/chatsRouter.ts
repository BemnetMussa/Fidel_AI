import express from "express";
import {
  getConverstations,
  createConverstation,
  getConverstationsWithMessage,
  deleteConverstation,
} from "../controllers/chatsController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

// router.get("/", requireAuth, getConverstations);
router.post("/", requireAuth, createConverstation);

// router.get("/:chatId", requireAuth, getConverstationsWithMessage);
// router.delete("/:chatId", requireAuth, deleteConverstation);

export default router;

