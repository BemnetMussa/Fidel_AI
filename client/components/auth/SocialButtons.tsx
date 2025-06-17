import type React from "react"
import { View } from "react-native"
import { Button } from "@/components/ui/Button"

interface SocialButtonsProps {
  onGooglePress: () => void
  onFacebookPress: () => void
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({ onGooglePress, onFacebookPress }) => {
  return (
    <View className="flex-row gap-3">
      <View className="flex-1">
        <Button title="GOOGLE" onPress={onGooglePress} variant="google" />
      </View>
      <View className="flex-1">
        <Button title="FACEBOOK" onPress={onFacebookPress} variant="facebook" />
      </View>
    </View>
  )
}
