import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db";
import { AuthenticatedRequest } from "../types/express";


// Create a conversation
export const createConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user;
    const { title } = req.body;

    console.log("Creating conversation for user:", userId.id, "with title:", title);
    
    const conversation = await prisma.conversation.create({
      data: {
        userId: userId.id,
        title: title || "New Conversation",
      },
    });

    if (!conversation) {
      const error = new Error("Failed to create conversation");
      res.status(500);
      next(error);
      return;
    }
    console.log("Conversation created successfully:", conversation);
    res.status(201).json({
      message: "Conversation created successfully",
      conversation,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }

};


// Get all conversations for a user
export const getConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user;
    console.log("Fetching conversations for user:", userId.id);
    const conversations = await prisma.conversation.findMany({
      where: { userId: userId.id },
    });

    if (!conversations || conversations.length === 0) {
      console.log("No conversations found for user:", userId.id);
      const error = new Error("No conversations found");
      res.status(404);
      next(error);
      return;
    }
    console.log("Conversations fetched successfully for user:", userId.id, "Count:", conversations.length);
    res.status(200).json({

      message: "All conversations fetched successfully",
      conversations,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }

};

// Get a conversation with its messages
export const getConversationWithMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user;
    const conversationId = parseInt(req.params.id);

    if (isNaN(conversationId)) {
      res.status(400);
      next(new Error("Invalid conversation ID"));
      return;
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: userId.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      const error = new Error("Conversation not found or no messages available");
      res.status(404);
      next(error);
      return;
    }

    res.status(200).json({
      message: "Conversation with messages fetched successfully",
      conversation,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Delete a conversation
export const deleteConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user;
    const conversationId = parseInt(req.params.id);

    if (isNaN(conversationId)) {
      res.status(400);
      next(new Error("Invalid conversation ID"));
      return;
    }

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: userId.id,
      },
    });

    if (!existingConversation) {
      res.status(404);
      next(new Error("Conversation not found"));
      return;
    }

    await prisma.conversation.delete({
      where: { id: conversationId },
    });

    res.json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
