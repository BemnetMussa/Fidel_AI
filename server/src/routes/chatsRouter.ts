import express from "express";
import {
  getConverstations,
  createConverstation,
  getConverstationsWithMessage,
  deleteConverstation,
} from "../controllers/chatsController";
import { requireAuth } from "../middlewares/requireAuth";
import { createMessage } from "../controllers/messageController";

const router = express.Router();
console.log("Chats router initialized");
// router.get("/", requireAuth, getConverstations);
router.post("/chat/:conversationId?", requireAuth, createMessage);

// router.get("/:chatId", requireAuth, getConverstationsWithMessage);
// router.delete("/:chatId", requireAuth, deleteConverstation);

export default router;


    