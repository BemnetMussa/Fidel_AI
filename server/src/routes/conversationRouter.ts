import express from "express";
import {
  getConverstations,
  getConverstationsWithMessage,
  deleteConverstation,
  updateConversation,
  deleteConversationById,
} from "../controllers/conversationController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router
  .get("/", requireAuth, getConverstations)
  .delete("/", requireAuth, deleteConverstation);
router
  .get("/:conversationId", requireAuth, getConverstationsWithMessage)
  .put("/:conversationId", requireAuth, updateConversation)
  .delete("/:conversationId", requireAuth, deleteConversationById);

export default router;
