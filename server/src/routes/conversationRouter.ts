import express from "express";
import {
  getConverstations,
  createConverstation,
  getConverstationsWithMessage,
  deleteConverstation,
} from "../controllers/conversationController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.post("/", requireAuth, createConverstation);
router.get("/", requireAuth, getConverstations);
router.get("/:conversationId", requireAuth, getConverstationsWithMessage);
router.delete("/:conversationId", requireAuth, deleteConverstation);

export default router;
