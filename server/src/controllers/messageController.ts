import { prisma } from "../lib/auth";
import { AuthenticatedRequest } from "../types/express";
import { NextFunction, Request, Response } from "express";

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { content } = req.body;
    const userId = (req as AuthenticatedRequest).user.id;
    const chatId = req.params;

    const Message = await prisma.message.create({
      userId,
      chatId,
      content,
    });

    if (!Message) {
      const error = new Error("Message not found");
      res.status(404);
      next(error);
      return;
    }

    res.status(201).json({
      message: "Message created successfuly",
      Message,
    });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};

export const updateMessgae = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthenticatedRequest).user;
    const chatId = req.params;
    const messageId = req.params;
    const { content } = req.body;

    const existingMessage = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
        messageId,
      },
    });

    if (!existingMessage) {
      const error = new Error("Message not found.");
      res.status(404);
      next(error);
      return;
    }

    await prisma.Message.update({
      where: { id: messageId },
      content,
    });

    res.json({ message: "Message deleted successfully." });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};

export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthenticatedRequest).user;
    const chatId = req.params;
    const messageId = req.params;

    const existingMessage = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
        messageId,
      },
    });

    if (!existingMessage) {
      const error = new Error("Message not found.");
      res.status(404);
      next(error);
      return;
    }

    await prisma.Message.delete({
      where: { id: messageId },
    });

    res.json({ message: "Message deleted successfully." });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};
