"use client"

import type React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { cn } from "@/lib/utils"

interface AuthHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle, showBackButton = false }) => {
  const router = useRouter()

  return (
    <View className="pt-16 pb-8 px-6 relative">
      {showBackButton && (
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-16 left-6 w-10 h-10 rounded-full items-center justify-center z-10"
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
      )}

      <View className={cn("items-start", showBackButton && "mt-12")}>
        <Text className="text-3xl font-bold text-gray-900 mb-2">{title}</Text>
        {subtitle && <Text className="text-base text-gray-500 leading-6">{subtitle}</Text>}
      </View>
    </View>
  )
}
