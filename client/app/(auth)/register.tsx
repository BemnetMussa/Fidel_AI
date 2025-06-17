"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { useRouter } from "expo-router"
import { AuthHeader } from "@/components/auth/AuthHeader"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { SocialButtons } from "@/components/auth/SocialButtons"

export default function RegisterScreen() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // TODO: Implement actual registration logic
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call
      router.push("/(auth)/verify-email")
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Register with ${provider}`)
    // TODO: Implement social registration
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
        <AuthHeader title="Create your Account" showBackButton />

        <View className="px-6 pb-8">
          <Input
            placeholder="Full name"
            value={formData.name}
            onChangeText={(value) => updateFormData("name", value)}
            error={errors.name}
            leftIcon="person"
          />

          <Input
            placeholder="Enter Your Email"
            value={formData.email}
            onChangeText={(value) => updateFormData("email", value)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail"
          />

          <Input
            placeholder="Password"
            value={formData.password}
            onChangeText={(value) => updateFormData("password", value)}
            error={errors.password}
            isPassword
            leftIcon="lock-closed"
          />

          <Button title="Register" onPress={handleRegister} loading={isLoading} className="mb-6" />

          <View className="items-center mb-4">
            <Text className="text-sm text-gray-500 mb-2">Already Have An Account?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text className="text-sm text-gray-900 font-semibold">Sign in</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-center text-gray-500 text-sm mb-4">Continue With Accounts</Text>

          <SocialButtons
            onGooglePress={() => handleSocialLogin("Google")}
            onFacebookPress={() => handleSocialLogin("Facebook")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
