// import { Request, Response, NextFunction } from "express";
// import prisma from "../config/db";


// export const getUsers = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const users = await prisma.user.findMany({
//       select: { id: true, email: true, name: true },
//     });
//     res.json(users);
//   } catch (error) {
//     next(error);
//     return;
//   }
// };

// export const fetchUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = req.params.id;

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { id: true, email: true, name: true },
//     });
//     res.json(user);
//   } catch (error) {
//     next(error);
//     return;
//   }
// };

// export const generateToken = (req: Request, res: Response) => {
//   const { userId } = req.body;

//   const accessToken = generateAccessToken(userId);
//   const refreshToken = generateRefreshToken(userId);
//   res.json({ accessToken, refreshToken });
//   return;
// };

// export const refresh = (req: Request, res: Response) => {
//   const { refreshToken } = req.body;

//   if (!refreshToken) {
//     res.status(401).json({ error: "Missing refresh token" });
//     return;
//   }

//   try {
//     const payload = verifyRefreshToken(refreshToken) as any;

//     const newAccessToken = generateAccessToken(payload.userId);
//     res.json({ accessToken: newAccessToken });
//     return;
//   } catch (err) {
//     res.status(403).json({ error: "Invalid refresh token" });
//     return;
//   }
// }
