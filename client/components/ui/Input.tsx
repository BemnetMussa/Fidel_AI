"use client"

import type React from "react"
import { useState } from "react"
import { View, TextInput, Text, TouchableOpacity, type TextInputProps } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { cn } from "@/lib/utils"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  isPassword?: boolean
  leftIcon?: keyof typeof Ionicons.glyphMap
  className?: string
  containerClassName?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword = false,
  leftIcon,
  className,
  containerClassName,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View className={cn("mb-6", containerClassName)}>
      <View
        className={cn(
          "flex-row items-center border-2 rounded-2xl px-4 bg-white min-h-[56px]",
          error ? "border-red-500" : isFocused ? "border-gray-900" : "border-gray-200",
        )}
      >
        {leftIcon && <Ionicons name={leftIcon} size={20} color="#9CA3AF" className="mr-3" />}
        <TextInput
          className={cn("flex-1 text-base text-gray-900 py-0", className)}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} className="p-1">
            <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-sm text-red-500 mt-2">{error}</Text>}
    </View>
  )
}
