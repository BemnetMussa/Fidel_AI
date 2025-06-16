import type React from "react"
import { TouchableOpacity, Text, ActivityIndicator } from "react-native"
import { cn } from "@/lib/utils"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline" | "google" | "facebook"
  disabled?: boolean
  loading?: boolean
  className?: string
  textClassName?: string
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  className,
  textClassName,
}) => {
  const getButtonClasses = () => {
    const baseClasses = "py-4 px-6 rounded-2xl items-center justify-center min-h-[56px]"

    switch (variant) {
      case "primary":
        return cn(baseClasses, disabled ? "bg-gray-400" : "bg-gray-900", className)
      case "secondary":
        return cn(baseClasses, disabled ? "bg-gray-200" : "bg-gray-200", className)
      case "outline":
        return cn(baseClasses, "bg-transparent", disabled ? "border-gray-400" : "border-gray-900", "border", className)
      case "google":
        return cn(baseClasses, "bg-red-100", className)
      case "facebook":
        return cn(baseClasses, "bg-blue-100", className)
      default:
        return cn(baseClasses, className)
    }
  }

  const getTextClasses = () => {
    const baseClasses = "text-base font-semibold"

    switch (variant) {
      case "primary":
        return cn(baseClasses, "text-white", textClassName)
      case "secondary":
        return cn(baseClasses, "text-gray-600", textClassName)
      case "outline":
        return cn(baseClasses, disabled ? "text-gray-400" : "text-gray-900", textClassName)
      case "google":
        return cn(baseClasses, "text-red-600", textClassName)
      case "facebook":
        return cn(baseClasses, "text-blue-600", textClassName)
      default:
        return cn(baseClasses, textClassName)
    }
  }

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#FFFFFF" : "#000000"} />
      ) : (
        <Text className={getTextClasses()}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}
