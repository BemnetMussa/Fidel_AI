import express from "express";
import {
  getConverstations,
  createConverstation,
  getConverstationsWithMessage,
  deleteConverstation,
} from "../controllers/conversationController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router
  .post("/", requireAuth, createConverstation)
  .get("/", requireAuth, getConverstations)
  .delete("/", requireAuth, deleteConverstation);
router.get("/:conversationId", requireAuth, getConverstationsWithMessage);

export default router;
