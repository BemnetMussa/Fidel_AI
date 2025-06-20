import express from "express";
import {
  getChats,
  createChats,
  getChatWithMessage,
  deleteChat,
} from "../controller/chatsController";
// import { requireAuth } from "../middleware/"; // your auth middleware

const router = express.Router();

// router.use(requireAuth);

router.get("/", getChats);
router.post("/", createChats);
router.get("/:chatId", getChatWithMessage);
router.delete("/:chatId", deleteChat);

export default router;
