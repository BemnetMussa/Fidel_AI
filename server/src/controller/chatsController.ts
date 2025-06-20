import { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import { prisma } from "../config/db";

//create chat
export const createChats = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { title } = req.body;

    const chat = await prisma.chat.create({
      data: {
        userId,
        title: title || "",
      },
    });
    res.status(201).json({
      message: "chat created successfuly",
      chat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create chat." });
    return;
  }
};

// get all chats
export const getChats = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;

    const chats = await prisma.chat.findMany({
      userId,
    });

    res.status(201).json({
      message: "all message was fetched",
      chats,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch the chats.",
    });
    return;
  }
};

//get chat with message
export const getChatWithMessage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const chatId = req.params;

    const chatWithMessage = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chatWithMessage) {
      res.status(404).json({ error: "Chat not found." });
      return;
    }

    res.status(201).json({
      message: "successful fetch chat with the message",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Failed to fetch the chats with message.",
    });
    return;
  }
};

//Delete a chat
export const deleteChat = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const chatId = req.params;

    const existingChat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
    });

    if (!existingChat) {
      res.status(404).json({ error: "Chat not found." });
      return;
    }

    await prisma.chat.delete({
      where: { id: chatId },
    });

    res.json({ message: "Chat deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Failed to delete the chat.",
    });
    return;
  }
};
