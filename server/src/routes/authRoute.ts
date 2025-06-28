import express from "express";
import { fetchUser, getUsers, submitFeedback } from "../controllers/userController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/users", requireAuth, getUsers);
router.get("/user", requireAuth, fetchUser);
router.post("/feedback", requireAuth, submitFeedback)


export default router;
