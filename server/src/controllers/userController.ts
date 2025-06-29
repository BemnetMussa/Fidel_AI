import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true },
    });
    res.json(users);
  } catch (error) {
    next(error);
    return;
  }
};

export const fetchUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
    res.json(user);
  } catch (error) {
    next(error);
    return;
  }
};


export const submitFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { feedback, email } = req.body;

    if (!feedback || !email) {
      res.status(400).json({ message: "Feedback and email are required." });
      return
    }
    const feedbackCreate = await prisma.feedback.create({
      data: {
        email: email,
        message: feedback,
      },
    });

    if (!feedbackCreate) {
      res.status(500).json({ message: "Failed to create feedback." });
      return;
    }
    res.status(200).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit feedback." });
    next(error);
  }
};