import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { emailOTP } from "better-auth/plugins";
import { sendEmail } from "./sendEmail";

export const prisma = new PrismaClient().$extends(withAccelerate());

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // REPLACE WITH YOUR SOCIAL PROVIDERS FACEBOOK AND GOOGLE
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      },
    },
  },
  plugins: [
    emailOTP({
      otpLength: 8,
      expiresIn: 100,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign-in
        } else if (type === "email-verification") {
          await sendEmail({
            to: email,
            subject: "Verify Your Email Address",
            text: `
Hi there,

To verify your email address, use this OTP:

🔐 ${otp}

This code expires in 1 minutes.

If you didn’t request this, ignore this email.

Thanks,  
Fidle Ai
    `,
          });
        } else {
          // Send the OTP for password reset

          const subject = "Reset Your Password";

          const text = `
Hi,

We received a request to reset the password for your account.

Use the following code to reset your password:

🔐 Your password reset code: ${otp}

This code will expire in 5 minutes. If you did not request a password reset, please ignore this email.

Thanks,
Fidle Ai
`;

          await sendEmail({
            to: email,
            subject,
            text,
          });
        }
      },
    }),
  ],
  secret: process.env.BETTER_AUTH!,
});
