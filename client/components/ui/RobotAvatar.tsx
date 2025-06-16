import type React from "react"
import { View, Text } from "react-native"
import { cn } from "@/lib/utils"

interface RobotAvatarProps {
  size?: "small" | "medium" | "large"
  className?: string
}

export const RobotAvatar: React.FC<RobotAvatarProps> = ({ size = "medium", className }) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "w-12 h-12"
      case "medium":
        return "w-16 h-16"
      case "large":
        return "w-20 h-20"
      default:
        return "w-16 h-16"
    }
  }

  return (
    <View className={cn("relative items-center justify-center", getSizeClasses(), className)}>
      {/* Robot head/body */}
      <View className="w-full h-full bg-gray-800 rounded-2xl items-center justify-center relative">
        {/* Eyes */}
        <View className="flex-row space-x-1 mb-1">
          <View className="w-1.5 h-1.5 bg-white rounded-full" />
          <View className="w-1.5 h-1.5 bg-white rounded-full" />
        </View>

        {/* Mouth/speaker */}
        <View className="w-3 h-1 bg-white rounded-full" />

        {/* Speech bubble */}
        <View className="absolute -top-2 -right-1 bg-white rounded-full w-6 h-6 items-center justify-center border border-gray-200">
          <Text className="text-xs font-bold text-gray-800">pAI</Text>
        </View>
      </View>
    </View>
  )
}
