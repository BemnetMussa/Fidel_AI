import express from "express";
import dotenv from "dotenv";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import chatRouter from "./routes/chatsRouter";
// import messageRouter from "./routes/messageRoute";
import cors from "cors";
import userRouter from "./routes/authRoute";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.all("/api/auth/*splat", toNodeHandler(auth)); //For ExpressJS v5

// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());

// Configure CORS middleware
app.use(
  cors({
    origin: "exp://192.168.1.8:8081", // or your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api", userRouter);

async function main() {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
