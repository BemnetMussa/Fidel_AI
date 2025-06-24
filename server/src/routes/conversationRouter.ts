import express from "express";
import {
  getConverstations,
  createConverstation,
  getConverstationsWithMessage,
  deleteConverstation,
  updateConversation,
} from "../controllers/conversationController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router
  .post("/", requireAuth, createConverstation)
  .get("/", requireAuth, getConverstations)
  .delete("/", requireAuth, deleteConverstation);
router
  .get("/:conversationId", requireAuth, getConverstationsWithMessage)
  .put("/conversationId", requireAuth, updateConversation);

export default router;
