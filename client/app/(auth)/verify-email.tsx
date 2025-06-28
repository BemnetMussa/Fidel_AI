"use client";

import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { OTPInput } from "@/components/ui/OTPInput";
import { Button } from "@/components/ui/Button";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";

const otpSchema = z.object({
  otp: z.string().regex(/^\d{4}$/, { message: "OTP must be 4 digits" }),
});

type OtpData = z.infer<typeof otpSchema>;

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { email } = useLocalSearchParams<{ email?: string }>();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const onSubmit = async ({ otp }: OtpData) => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.emailOtp.verifyEmail({
        email: email!,
        otp,
      });

      if (error) {
        Alert.alert("Verification Failed", error.message);
      } else {
        router.replace("/chats");
      }
    } catch (error) {
      Alert.alert("Error", "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: email!,
        type: "email-verification",
      });

      if (error) {
        Alert.alert("Error", error.message || "Failed to resend OTP");
      } else {
        setResendTimer(60);
        setCanResend(false);
        Alert.alert("OTP Sent", "A new OTP has been sent to your email.");
      }
    } catch {
      Alert.alert("Error", "Failed to resend OTP");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-primary"
      showsVerticalScrollIndicator={false}
    >
      <View className="pt-16 pb-8 px-6 relative">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-16 left-6 w-10 h-10 rounded-full items-center justify-center z-10"
        >
          <Text className="text-2xl text-gray-600">←</Text>
        </TouchableOpacity>

        <View className="items-center mt-12">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Verify Email
          </Text>
          <Text className="text-base text-gray-500 text-center mb-2">
            We have sent a code to your Email Number
          </Text>
          <Text className="text-base text-gray-900 font-medium">
            {email || "your email"}
          </Text>
        </View>
      </View>

      <View className="px-6 pb-8 items-center">
        <Controller
          control={control}
          name="otp"
          render={({ field: { value, onChange } }) => (
            <OTPInput
              length={4}
              onComplete={(code) => {
                onChange(code);
                setValue("otp", code);
              }}
              error={errors.otp?.message}
              className="mb-8"
            />
          )}
        />

        {errors.otp && (
          <Text className="text-sm text-red-500 mb-4 font-medium">
            {errors.otp.message}
          </Text>
        )}

        <Button
          title="Verify"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          className="w-full mb-6"
        />

        <TouchableOpacity
          onPress={handleResendOTP}
          disabled={!canResend}
          className="p-2"
        >
          <Text
            className={`text-sm ${canResend ? "text-gray-900" : "text-gray-400"}`}
          >
            {canResend ? "Send Again" : `Send Again (${resendTimer})`}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
