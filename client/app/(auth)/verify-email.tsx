"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import { OTPInput } from "@/components/ui/OTPInput"
import { Button } from "@/components/ui/Button"

export default function VerifyEmailScreen() {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  const handleVerifyOTP = async (otpCode: string) => {
    setOtp(otpCode)
    setError("")
    setIsLoading(true)

    try {
      // TODO: Implement actual OTP verification logic
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      // For demo purposes, accept any 4-digit code
      if (otpCode.length === 4) {
        router.push("/(auth)/reset-password")
      } else {
        setError("Invalid verification code")
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      setError("Invalid verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return

    try {
      // TODO: Implement actual resend OTP logic
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      setResendTimer(60)
      setCanResend(false)
      setError("")
    } catch (error) {
      console.error("Resend OTP error:", error)
    }
  }

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <View className="pt-16 pb-8 px-6 relative">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-16 left-6 w-10 h-10 rounded-full items-center justify-center z-10"
        >
          <Text className="text-2xl text-gray-600">←</Text>
        </TouchableOpacity>

        <View className="items-center mt-12">
          <Text className="text-2xl font-bold text-gray-900 mb-4">Verify Email</Text>
          <Text className="text-base text-gray-500 text-center mb-2">We have sent a code to your Email Number</Text>
          <Text className="text-base text-gray-900 font-medium">Joseph****@Mail.Com</Text>
        </View>
      </View>

      <View className="px-6 pb-8 items-center">
        <OTPInput length={4} onComplete={handleVerifyOTP} error={error} className="mb-8" />

        <Button title="Verify" onPress={() => handleVerifyOTP(otp)} loading={isLoading} className="w-full mb-6" />

        <TouchableOpacity onPress={handleResendOTP} disabled={!canResend} className="p-2">
          <Text className={`text-sm ${canResend ? "text-gray-900" : "text-gray-400"}`}>
            {canResend ? "Send Again" : `Send Again (${resendTimer})`}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
