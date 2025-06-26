"use client";

import { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { authClient } from "@/lib/auth-client";

// Define the response type for authClient.getSession()
interface SessionResponse {
  data: {
    session?: {
      token?: string;
    };
    user?: {
      id?: string;
      [key: string]: unknown;
    };
  } | null;
  error?: {
    message?: string;
    [key: string]: unknown;
  } | null;
}

export default function SplashScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Fetch session with a timeout
        const result: SessionResponse = await Promise.race([
          authClient.getSession(),
          new Promise<never>(() =>
            setTimeout(() => {
              console.log(new Error("Session check timed out"));
            }, 1000)
          ),
        ]);

        console.log("i am out");

        const { data, error } = result;

        if (error || !data?.session?.token) {
          console.warn("No valid session found:", error?.message || "No token");
          router.replace("/welcome");
        } else {
          console.log("TOKEN:", data.session.token);
          router.replace("/chats");
        }
      } catch (err) {
        console.error("Error getting session:", err);
        router.replace("/welcome");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [router]);

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
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
          እንኳን ወደ ፊደል AI በደና መጡ!
        </Text>
        {/* remove loading ui */}
      </View>

      <View className="pb-8">
        <Text className="text-lg font-bold text-gray-900 mb-1">pAI</Text>
        <Text className="text-sm text-gray-500">Version 1.0</Text>
      </View>
    </View>
  );
}
