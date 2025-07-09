import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db";
import { AuthenticatedRequest } from "../types/express";

// get all Converstation
export const getConverstations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    if (!conversations) {
      const error = new Error("Not conversations created");
      res.status(404);
      next(error);
      return;
    }

    res.status(201).json({
      message: "all conversations was fetched",
      conversations,
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
    const userId = (req as AuthenticatedRequest).user.id;
    const converstationId = req.params;

    const converstationWithMessage = await prisma.conversation.findFirst({
      where: {
        id: converstationId,
        userId,
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

    // find all conversation
    const conversation = await prisma.conversation.findMany({
      where: {
        userId,
      },
    });

    const conversationIds = conversation.map((c) => c.id);

    await prisma.message.deleteMany({
      where: {
        conversationId: { in: conversationIds },
      },
    });

    await prisma.conversation.deleteMany({
      where: {
        id: { in: conversationIds },
      },
    });

    res.json({ message: "Chat deleted successfully." });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};

// delete conversation by id

export const deleteConversationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const conversationId = parseInt(req.params.conversationId);

  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!conversation) {
      const error = new Error("conversation does not exist");
      res.status(401);
      next(error);
      return;
    }

    const convId = conversation?.id;

    const deleteMessageFirst = await prisma.message.deleteMany({
      where: {
        conversationId,
      },
    });

    if (!deleteMessageFirst) {
      const error = new Error("can not delete message");
      res.status(401);
      next(error);
      return;
    }

    await prisma.conversation.delete({
      where: {
        id: convId,
      },
    });

    res.status(200).json({
      message: "delete conversation successfuly",
    });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};

// update conversation
export const updateConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const conversationId = parseInt(req.params.conversationId);

  const { title } = req.body;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!conversation) {
      const error = new Error("conversation does not exist");
      res.status(401);
      next(error);
      return;
    }

    const updateConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        title: title,
      },
    });

    res.status(200).json({
      updateConversation,
    });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};
