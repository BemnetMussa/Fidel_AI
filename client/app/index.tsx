"use client"

import { useEffect } from "react"
import { View, Text, Image } from "react-native"
import { useRouter } from "expo-router"
import { RobotAvatar } from "@/components/ui/RobotAvatar"

export default function SplashScreen() {
  const router = useRouter()

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      // TODO: Check if user is authenticated
      const isAuthenticated = false // This should come from your auth state

      if (isAuthenticated) {
        router.replace("/chats")
      } else {
        router.replace("/welcome")
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <View className="flex-1 items-center justify-center">
           <Image
                  source={require("@/assets/images/logo.png")}
                  style={{ width: 150, height: 150, resizeMode: "contain", marginBottom: 32 }}
                  accessible
                  accessibilityLabel="Fidel Logo"
                />
        
            
            <Text className="text-3xl font-bold text-gray-900 text-center mb-2">እንኳን ወደ ፊደል AI በደና መጡ! </Text>
        
      </View>

      <View className="pb-8">
        <Text className="text-lg font-bold text-gray-900 mb-1">pAI</Text>
        <Text className="text-sm text-gray-500">Version 1.0</Text>
      </View>
    </View>
  )
}
