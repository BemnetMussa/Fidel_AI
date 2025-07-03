import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { emailOTP } from "better-auth/plugins";
import { sendEmail } from "./sendEmail"; // adjust path if needed

export const prisma = new PrismaClient().$extends(withAccelerate());

// Base URL for the auth client
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    github: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    // facebook: {
    //   prompt: "select_account",
    //   clientId: process.env.FACEBOOK_CLIENT_ID!,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    // },
  },
  plugins: [
    emailOTP({
      otpLength: 4, // 4 digit OTP
      expiresIn: 300, // 5 minutes
      async sendVerificationOTP({ email, otp, type }) {
        console.log("[OTP SEND] Called with type:", type, "email:", email);
        try {
          if (type === "sign-in") {
            console.log("[OTP SEND] Sign-in OTP not implemented.");
          } else if (type === "email-verification") {
            console.log("[OTP SEND] Sending verification OTP:", otp);
            await sendEmail({
              to: email,
              subject: "Verify Your Email Address",
              text: `
Hi there,

To verify your email address, use this OTP:

🔐 ${otp}

This code expires in 5 minutes.

If you didn’t request this, ignore this email.

Thanks,  
 ፊደል <Text className="text-secondary">AI</Text>
              `,
            });
            console.log("[OTP SEND] Verification email sent successfully.");
          } else {
            const subject = "Reset Your Password";
            const text = `
Hi,

We received a request to reset the password for your account.

Use the following code to reset your password:

🔐 Your password reset code: ${otp}

This code will expire in 5 minutes. If you did not request a password reset, please ignore this email.

Thanks,
 ፊደል <Text className="text-secondary">AI</Text>
            `;

            await sendEmail({ to: email, subject, text });
            console.log("[OTP SEND] Password reset email sent successfully.");
          }
        } catch (error) {
          console.error("[OTP SEND] Failed to send OTP email:", error);
        }
      },
    }),
  ],
  secret: process.env.BETTER_AUTH_SECRET!,
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          console.log("Creating user with:", user);
          return { data: user };
        },
      },
    },
    account: {
      create: {
        after: async (account) => {
          console.log("🟢 Account created successfully:", account);
        },
      },
    },
  },
});
