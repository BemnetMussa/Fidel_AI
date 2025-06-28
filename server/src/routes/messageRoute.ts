import express from "express";
import {
  createMessage,
  deleteMessage,
  getMessages,
  updateMessage,
} from "../controllers/messageController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.post("/", requireAuth, createMessage);
router.post("/:conversationId", requireAuth, createMessage);
router.get("/:conversationId", requireAuth, getMessages); // this fetch message
router.put("/:messageId", requireAuth, updateMessage);
router.delete("/:messageId", requireAuth, deleteMessage);

export default router;
