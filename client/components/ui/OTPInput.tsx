"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { View, TextInput, Text } from "react-native"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  onComplete: (otp: string) => void
  error?: string
  className?: string
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 4, onComplete, error, className }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""))
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRefs = useRef<TextInput[]>([])

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
      setActiveIndex(index + 1)
    }

    const otpString = newOtp.join("")
    if (otpString.length === length) {
      onComplete(otpString)
    }
  }

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace") {
      const newOtp = [...otp]
      if (otp[index]) {
        newOtp[index] = ""
        setOtp(newOtp)
      } else if (index > 0) {
        newOtp[index - 1] = ""
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
        setActiveIndex(index - 1)
      }
    }
  }

  return (
    <View className={cn("items-center", className)}>
      <View className="flex-row justify-between w-full max-w-[280px] mb-6">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref
            }}
            className={cn(
              "w-16 h-16 border-2 rounded-2xl text-center text-2xl font-bold text-gray-900 bg-white",
              error ? "border-red-500" : activeIndex === index ? "border-gray-900" : "border-gray-200",
            )}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            onFocus={() => setActiveIndex(index)}
            keyboardType="numeric"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>
      {error && <Text className="text-sm text-red-500 text-center">{error}</Text>}
    </View>
  )
}
