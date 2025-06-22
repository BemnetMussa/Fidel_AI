import express from "express";
import { getUsers } from "../controllers/userController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/users", requireAuth, getUsers);

export default router;
