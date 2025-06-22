import { prisma } from "../lib/auth";
import { AuthenticatedRequest } from "../types/express";
import { NextFunction, Request, Response } from "express";
import axios from "axios";

// Gemini credentials
const GEMINI_API_URL = process.env.GEMINI_API_URL!;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("Handling chat message request...");
    const userId = (req as AuthenticatedRequest).user.id;
    const { user } = req.body;

    // Optional: Read conversationId from URL param
    let conversationId: number | null = null;
    const paramId = req.params.conversationId;

    let conversation = null;

    // Try to find conversation if a valid param was passed
    if (paramId && !isNaN(Number(paramId))) {
      conversationId = parseInt(paramId);
      console.log("Received conversationId:", conversationId);

      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });
    }

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

    if (conversationId === null) {
      const error = new Error("Conversation ID is required.");
      res.status(400);
      next(error);
      return;
    }
    // 1. Save user message
    const userMessage = await prisma.message.create({
      data: {
        content: user,
        sender: "USER",
        conversationId: conversationId!,
      },
    });

    // 2. Call Gemini API
    const geminiResponse = await axios.post(
      GEMINI_API_URL,
      {
        contents: [{ parts: [{ text: user }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          // You can add your Gemini API key here if needed
          Authorization: `Bearer ${GEMINI_API_KEY}`,
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

// export const updateMessgae = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = (req as AuthenticatedRequest).user.id;
//     const chatId = req.params;
//     const messageId = parseInt(req.params.id);
//     const { content } = req.body;

//     const existingMessage = await prisma.conversation.findFirst({
//       where: {
//         id: chatId,
//         userId: userId,
//         messages: messageId,
//       },
//     });

//     if (!existingMessage) {
//       const error = new Error("Message not found.");
//       res.status(404);
//       next(error);
//       return;
//     }

//     await prisma.message.update({
//       where: { id: messageId },
//       content,
//     });

//     res.json({ message: "Message deleted successfully." });
//   } catch (error) {
//     console.log(error);
//     next(error);
//     return;
//   }
// };

// export const deleteMessage = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = (req as AuthenticatedRequest).user.id;
//     const chatId = req.params;
//     const messageId = parseInt(req.params.id);

//     const existingMessage = await prisma.message.findFirst({
//       where: {
//         id: messageId

//       },
//     });

//     if (!existingMessage) {
//       const error = new Error("Message not found.");
//       res.status(404);
//       next(error);
//       return;
//     }

//     await prisma.message.delete({
//       where: { id: messageId },
//     });

//     res.json({ message: "Message deleted successfully." });
//   } catch (error) {
//     console.log(error);
//     next(error);
//     return;
//   }
// };
