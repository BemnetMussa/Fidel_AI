"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { useRouter } from "expo-router"
import { AuthHeader } from "@/components/auth/AuthHeader"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { SocialButtons } from "@/components/auth/SocialButtons"

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // TODO: Implement actual login logic
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call
      router.replace("/(tabs)/chats")
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    // TODO: Implement social login
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <AuthHeader title="Login Your Account" showBackButton />

        <View className="px-6 pb-8">
          <Input
            placeholder="Enter Your Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail"
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            isPassword
            leftIcon="lock-closed"
          />

          <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")} className="self-end mb-6">
            <Text className="text-sm text-gray-500">Forgot Password?</Text>
          </TouchableOpacity>

          <Button title="Login" onPress={handleLogin} loading={isLoading} className="mb-6" />

          <View className="items-center mb-4">
            <Text className="text-sm text-gray-500 mb-2">Create New Account?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text className="text-sm text-gray-900 font-semibold">Sign up</Text>
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
