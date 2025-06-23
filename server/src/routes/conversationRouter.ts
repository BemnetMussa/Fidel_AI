import express from "express";
import {
  getConversations,
  createConversation,
  getConversationWithMessages,
  deleteConversation,
} from "../controllers/conversationController";
import { requireAuth } from "../middlewares/requireAuth";
import { get } from "http";

const router = express.Router();

router.post("/", requireAuth, createConversation);
router.get("/", requireAuth, getConversations);
router.get("/:conversationId", requireAuth, getConversationWithMessages);
router.delete("/:conversationId", requireAuth, deleteConversation);

export default router;
