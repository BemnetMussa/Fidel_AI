import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "@/global.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Toast from "react-native-toast-message";
import { useEffect } from "react";

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

  return (
    <ThemeProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
      </Stack>

      <Toast />
    </ThemeProvider>
  );
}
