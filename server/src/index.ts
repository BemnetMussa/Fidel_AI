import express from "express";
import dotenv from "dotenv";
import { auth } from "./lib/auth";
import { adaptApiHandler } from "./route/adaptRequestResponse";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Auth routes
app.post("/auth/signup", adaptApiHandler(auth.api.signUpEmail));
app.post("/auth/login", adaptApiHandler(auth.api.signInEmail));
app.get("/auth/session", adaptApiHandler(auth.api.getSession));
app.post("/auth/logout", adaptApiHandler(auth.api.signOut));

async function main() {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
