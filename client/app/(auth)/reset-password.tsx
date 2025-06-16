"use client"

import { useState } from "react"
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { useRouter } from "expo-router"
import { AuthHeader } from "@/components/auth/AuthHeader"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export default function ResetPasswordScreen() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: { newPassword?: string; confirmPassword?: string } = {}

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleResetPassword = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // TODO: Implement actual password reset logic
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call
      router.replace("/(auth)/login")
    } catch (error) {
      console.error("Reset password error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <AuthHeader title="Reset Your Password" showBackButton />

        <View className="px-6 pb-8">
          <Input
            placeholder="New Password"
            value={formData.newPassword}
            onChangeText={(value) => updateFormData("newPassword", value)}
            error={errors.newPassword}
            isPassword
            leftIcon="lock-closed"
          />

          <Input
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData("confirmPassword", value)}
            error={errors.confirmPassword}
            isPassword
            leftIcon="lock-closed"
          />

          <Button title="Reset" onPress={handleResetPassword} loading={isLoading} className="mt-2" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
