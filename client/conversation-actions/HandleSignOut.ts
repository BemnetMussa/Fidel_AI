import { authClient } from "@/lib/auth-client";
import { clearAllConversations } from "@/lib/storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

interface HandleLogoutProps {
  onClose: () => void;
}

export const useHandleLogout = () => {
  const router = useRouter();

  const handleLogout = ({ onClose }: HandleLogoutProps) => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await authClient.signOut({
              fetchOptions: {},
            });

            setTimeout(() => {
              router.push("/(auth)/login");
              onClose();
            }, 0);
          } catch (error) {
            console.error("Error logging out:", error);
            Alert.alert("Error", "Failed to log out.");
          }
        },
      },
    ]);
  };

  return handleLogout;
};
