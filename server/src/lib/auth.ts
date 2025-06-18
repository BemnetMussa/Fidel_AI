import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { emailOTP } from "better-auth/plugins";

export const prisma = new PrismaClient().$extends(withAccelerate());

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // REPLACE WITH YOUR SOCIAL PROVIDERS FACEBOOK AND GOOGLE
    // socialProviders: {
    //     github: {
    //        clientId: process.env.GITHUB_CLIENT_ID as string,
    //        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    //     },
    // },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // Implement the sendVerificationOTP method to send the OTP to the user's email address
      },
    }),
  ],
  secret: process.env.BETTER_AUTH!,
});
