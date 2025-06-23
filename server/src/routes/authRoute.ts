import express from "express";
import {
  fetchUser,
  generateToken,
  getUsers,
  refresh,
} from "../controllers/userController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/users", requireAuth, getUsers);
router.get("/user", requireAuth, fetchUser);
router.post("/generate-token", generateToken);
router.post("/refresh-token", refresh);

export default router;
