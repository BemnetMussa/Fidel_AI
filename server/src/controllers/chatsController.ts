import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db";
import { AuthenticatedRequest } from "../types/express";

//create chat
export const createConverstation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user;
    const { title } = req.body;

    const chat = await prisma.converstation.create({
      data: {
        userId,
        title: title || "",
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

    const converstation = await prisma.converstation.findMany({
      userId,
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

    const converstationWithMessage = await prisma.converstation.findFirst({
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
    const userId = (req as AuthenticatedRequest).user;
    const converstationId = req.params;

    const existingConversation = await prisma.converstation.findFirst({
      where: {
        id: converstationId,
        userId,
      },
    });

    if (!existingConversation) {
      const error = new Error("Chat not found.");
      res.status(404);
      next(error);
      return;
    }

    await prisma.chat.delete({
      where: { id: converstationId },
    });

    res.json({ message: "Chat deleted successfully." });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};
