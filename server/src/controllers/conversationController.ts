import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db";
import { AuthenticatedRequest } from "../types/express";

console.log("Chats controller initialized");
//create chat
export const createConverstation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user;
    const { title } = req.body;

    console.log("Creating chat for user:", userId.id, "with title:", title);
    const chat = await prisma.conversation.create({
      data: {
        userId: userId.id,
        title: title || "New Chat",
      },
    });
    if (!chat) {
      const error = new Error("Chat not found");
      res.status(404);
      next(error);
      return;
    }
    res.status(201).json({
      message: "chat created successfuly",
      chat,
    });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};

// get all Converstation
export const getConverstations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user;

    const converstation = await prisma.conversation.findMany({
      where: {
        userId: userId.id,
      },
    });

    if (!converstation) {
      const error = new Error("Not Converstation created");
      res.status(404);
      next(error);
      return;
    }

    res.status(201).json({
      message: "all Converstation was fetched",
      converstation,
    });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};

//get chat with message
export const getConverstationsWithMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user;
    const converstationId = req.params;

    const converstationWithMessage = await prisma.conversation.findFirst({
      where: {
        id: converstationId,
        userId: userId.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }, //asending order
        },
      },
    });

    if (!converstationWithMessage) {
      const error = new Error("No message in this Converstation");
      res.status(404);
      next(error);
      return;
    }

    res.status(201).json({
      message: "successful fetch Converstation with the message",
    });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};

//Delete a chat
export const deleteConverstation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const converstationId = parseInt(req.params.id);

    console.log(userId, converstationId);

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        id: converstationId,
        userId: userId,
      },
    });

    if (!existingConversation) {
      const error = new Error("conversation not found.");
      res.status(404);
      next(error);
      return;
    }

    // Delete all related messages first to avoid foreign key constraint error
    await prisma.message.deleteMany({
      where: { conversationId: converstationId, sender: userId },
    });

    // Then delete the conversation
    await prisma.conversation.delete({
      where: {
        id: converstationId,
        userId: userId,
      },
    });

    res.json({ message: "Chat deleted successfully." });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};
