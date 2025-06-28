"use client";

import { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const handleResetPassword = async (data: ResetPasswordData) => {
    setIsLoading(true);
    try {
      await authClient.emailOtp.resetPassword(
        {
          email: "user-email@email.com", // Replace with actual email
          otp: "123456", // Replace with actual OTP
          password: data.newPassword,
        },
        {
          onSuccess: () => {
            router.replace("/(auth)/login");
          },
          onError: ({ error }) => {
            console.error("Reset error:", error);
          },
        }
      );
    } catch (error) {
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primary"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <AuthHeader title="Reset Your Password" showBackButton />

        <View className="px-6 pb-8">
          <Input
            placeholder="New Password"
            value={newPassword}
            onChangeText={(val) =>
              setValue("newPassword", val, { shouldValidate: true })
            }
            error={errors.newPassword?.message}
            isPassword
            leftIcon="lock-closed"
          />

          <Input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(val) =>
              setValue("confirmPassword", val, { shouldValidate: true })
            }
            error={errors.confirmPassword?.message}
            isPassword
            leftIcon="lock-closed"
          />

          <Button
            title="Reset"
            onPress={handleSubmit(handleResetPassword)}
            loading={isLoading}
            className="mt-2"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
