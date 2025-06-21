import express from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { createMessage} from "../controllers/messageController";

const router = express.Router();

router.get("/", requireAuth, createMessage);
// router.post("/messageId", requireAuth, updateMessgae);

export default router;

