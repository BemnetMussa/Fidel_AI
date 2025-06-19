import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "@/global.css";
import { GlobalToast } from "@/components/ui/GlobalToast";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
      </Stack>
      <GlobalToast />
    </>
  );
}
