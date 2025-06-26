"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { BadgeAlertIcon } from "lucide-react-native";
import Toast from "react-native-toast-message";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginScreen() {
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
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      console.log("Login user with data:", data);
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: async () => {
            (global as any).showAppToast({
              message: "Logged in successfully!",
              type: "success",
              duration: 3000,
            });

            const token = await authClient.getSession();

            if (token) {
              console.log(token.data?.session);
              router.replace("/chats");
            }
          },
          onError: ({ error }) => {
            setError(error.message);
          },
        }
      );
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <AuthHeader title="Login Your Account" showBackButton />

        <View className="px-6 pb-8">
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

          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
            className="self-end mb-6"
          >
            <Text className="text-sm text-gray-500">Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Login"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            className="mb-6"
          />

          <View className="items-center mb-4">
            <Text className="text-sm text-gray-500 mb-2">
              Create New Account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text className="text-sm text-gray-900 font-semibold">
                Sign up
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
