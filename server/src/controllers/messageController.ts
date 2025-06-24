import { prisma } from "../lib/auth";
import { AuthenticatedRequest } from "../types/express";
import { NextFunction, Request, Response } from "express";
import axios from "axios";

// Gemini credentials
const GEMINI_API_URL = process.env.GEMINI_API_URL!;

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("Handling chat message request...");
    const userId = (req as AuthenticatedRequest).user.id;
    const { content } = req.body;
    let conversationId = req.params.conversationId
      ? parseInt(req.params.conversationId)
      : null;

    // If no conversationId or invalid, create a new conversation
    let conversation = conversationId
      ? await prisma.conversation.findUnique({ where: { id: conversationId } })
      : null;

    // If conversation doesn't exist or doesn't belong to user, create a new one
    if (!conversation || conversation.userId !== userId) {
      conversation = await prisma.conversation.create({
        data: {
          userId,
          title: "New Chat",
        },
      });
      conversationId = conversation.id;
      console.log("New conversation created with ID:", conversationId);
    }

    if (!conversationId) {
      const error = new Error("Conversation ID is required.");
      res.status(400);
      next(error);
      return;
    }
    // 1. Save user message
    const userMessage = await prisma.message.create({
      data: {
        content,
        sender: "USER",
        conversationId: conversationId!,
      },
    });

    // 2. Call Gemini API
    const geminiResponse = await axios.post(
      GEMINI_API_URL,
      {
        contents: [{ parts: [{ text: content }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          // You can add your Gemini API key here if needed
          // "Authorization": `Bearer ${GEMINI_API_KEY}`,
        },
      }
    );

    const aiText =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm not sure how to respond to that.";

    // 3. Save AI message
    const aiMessage = await prisma.message.create({
      data: {
        content: aiText,
        sender: "AI",
        conversationId: conversationId!,
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // 4. Return conversation ID and both messages
    res.status(201).json({
      conversationId,
      userMessage,
      aiMessage,
    });
  } catch (error) {
    console.error("Chat handling error:", error);
    next(error);
  }
};

// get the message form db and send to client
export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let conversationId = parseInt(req.params.conversationId);

    const userId = (req as AuthenticatedRequest).user.id;

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        // sender: userId,
      },
      orderBy: {
        createdAt: "asc", // Optional: chronological order
      },
    });

    console.log(messages);

    if (!messages) {
      const error = new Error("messages are not found");
      res.status(400);
      next(error);
      return;
    }

    res.status(200).json({
      messages,
    });
  } catch (error) {
    next(error);
    return;
  }
};

export const updateMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const messageId = parseInt(req.params.messageId);
    console.log(messageId);
    const { content } = req.body;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { conversation: true },
    });

    if (!message) {
      const error = new Error("Message not found.");
      res.status(404);
      next(error);
      return;
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { content },
    });

    res.status(200).json(updatedMessage);
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
    const messageId = parseInt(req.params.id);
    const userId = (req as AuthenticatedRequest).user.id;

    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        conversation: true,
      },
    });

    if (!message) {
      const error = new Error("Message not found.");
      res.status(404);
      next(error);
      return;
    }

    if (message.conversation.userId !== userId) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    res.json({ message: "Message deleted successfully." });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};
