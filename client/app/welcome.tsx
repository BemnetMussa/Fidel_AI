"use client";

import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
import { RobotAvatar } from "@/components/ui/RobotAvatar";
import { SocialButtons } from "@/components/auth/SocialButtons";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-primary px-6">
      <View className="flex-1 items-center justify-center">
        <Image
          source={require("@/assets/images/logo.png")}
          style={{
            width: 150,
            height: 150,
            resizeMode: "contain",
            marginBottom: 32,
          }}
          accessible
          accessibilityLabel="Fidel Logo"
        />

        <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
          እንኳን ወደ ፊደል <Text className="text-secondary">AI</Text> በደና መጡ!{" "}
        </Text>
      </View>

      <View className="pb-10">
        <Button
          title="Log in"
          onPress={() => router.push("/(auth)/login")}
          className="mb-4"
        />

        <Button
          title="Sign up"
          onPress={() => router.push("/(auth)/register")}
          variant="secondary"
          className="mb-6"
        />

        <Text className="text-center text-gray-500 text-sm mb-4">
          Continue With Accounts
        </Text>

        <SocialButtons />
      </View>
    </View>
  );
}
