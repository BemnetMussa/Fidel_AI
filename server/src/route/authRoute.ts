import express from "express";
import userController from "../controller/userController";

const router = express.Router();

router.get("/users", userController.getUsers);

export default router;
