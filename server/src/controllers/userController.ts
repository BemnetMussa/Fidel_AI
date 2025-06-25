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
