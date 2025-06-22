import express from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
  createMessage,
  deleteMessage,
  updateMessage,
} from "../controllers/messageController";

const router = express.Router();

router.post("/:conversationId", requireAuth, createMessage);
// router.get("/conversations/:conversationId/messages", requireAuth, getMessages); this fetch message
router.put("/:messageId", requireAuth, updateMessage);
router.delete("/:messageId", requireAuth, deleteMessage);

export default router;
