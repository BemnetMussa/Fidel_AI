"use client";

import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const emailForgotSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotData = z.infer<typeof emailForgotSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotData>({
    resolver: zodResolver(emailForgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }: ForgotData) => {
    try {
      await authClient.emailOtp.sendVerificationOtp(
        {
          email: "user-email@email.com",
          type: "forget-password", // or "email-verification", ""
        },
        {
          onSuccess: (data) => {
            router.push({
              pathname: "/(auth)/verify-email",
              params: { email }, // pass email to the next screen
            });
          },
          onError: ({ error }) => {
            setError(error.message);
          },
        }
      );
    } catch (error) {
      console.log("Failed to send reset email:", error);
      (global as any).showAppToast({
        message: "Failed to send reset email. Try again!",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primary"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <AuthHeader title="Forgot Password" showBackButton />

        <View className="px-6 pb-8">
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail"
              />
            )}
          />

          <Button
            title="Send"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            className="mt-2"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
