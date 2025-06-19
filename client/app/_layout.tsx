
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import "@/global.css"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { GlobalToast } from "@/components/ui/GlobalToast";


export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
      </Stack>
    </ThemeProvider>
  )

}
