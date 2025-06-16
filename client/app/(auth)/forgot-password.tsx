"use client"

import { useState } from "react"
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { useRouter } from "expo-router"
import { AuthHeader } from "@/components/auth/AuthHeader"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSendOTP = async () => {
    if (!email) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      // TODO: Implement actual forgot password logic
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call
      router.push("/(auth)/verify-email")
    } catch (error) {
      console.error("Forgot password error:", error)
      setError("Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <AuthHeader title="Forgot Password" showBackButton />

        <View className="px-6 pb-8">
          <Input
            placeholder="Email"
            value={email}
            onChangeText={(value) => {
              setEmail(value)
              if (error) setError("")
            }}
            error={error}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail"
          />

          <Button title="Send" onPress={handleSendOTP} loading={isLoading} className="mt-2" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
