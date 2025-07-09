import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "@/global.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Toast from "react-native-toast-message";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function RootLayout() {
  useEffect(() => {
    (global as any).showAppToast = ({
      message,
      type = "success",
      duration = 3000,
    }: {
      message: string;
      type?: "success" | "error" | "info";
      duration?: number;
    }) => {
      Toast.show({
        type,
        text1: message,
        visibilityTime: duration,
      });
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await authClient.getSession();

      if (!session) {
        return (global as any).showAppToast({
          message: "unauthorized!",
          type: "error",
          duration: 3000,
        });
      }
    };

    checkAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="welcome" />
        </Stack>

        <Toast />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
