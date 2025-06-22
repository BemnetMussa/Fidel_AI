"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { BadgeAlertIcon } from "lucide-react-native";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Full name should at least be 3 character" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await authClient.signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          onRequest: () => {
            console.log("request send");
          },
          onSuccess: async () => {
            console.log("Registration successful, sending verification email");
            await authClient.emailOtp.sendVerificationOtp({
              email: data.email,
              type: "email-verification",
            });
            router.push({
              pathname: "/(auth)/verify-email",
              params: { email: data.email },
            });
          },
          onError: ({ error }) => {
            console.log("Registration error:", error);
            setError(error.message);
          },
        }
      );
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Register with ${provider}`);
    // TODO: Implement social registration
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <AuthHeader title="Create your Account" showBackButton />

        <View className="px-6 pb-8">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Full name"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
                leftIcon="person"
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Enter Your Email"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail"
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
                isPassword
                leftIcon="lock-closed"
              />
            )}
          />

          {error && (
            <View className="flex-row items-center space-x-2 p-3 rounded-md bg-red-100 border border-red-400 mt-4">
              <BadgeAlertIcon className="h-5 w-5 text-red-500" />
              <Text className="text-red-700 font-medium">{error}</Text>
            </View>
          )}

          <Button
            title="Register"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            className="mb-6"
          />

          <View className="items-center mb-4">
            <Text className="text-sm text-gray-500 mb-2">
              Already Have An Account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text className="text-sm text-gray-900 font-semibold">
                Sign in
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="text-center text-gray-500 text-sm mb-4">
            Continue With Accounts
          </Text>

          <SocialButtons
            onGooglePress={() => handleSocialLogin("Google")}
            onFacebookPress={() => handleSocialLogin("Facebook")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
