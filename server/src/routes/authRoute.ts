import express from "express";
import { fetchUser, getUsers } from "../controllers/userController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/users", requireAuth, getUsers);
router.get("/user", requireAuth, fetchUser);

export default router;
