import { authClient } from "@/lib/auth-client";
import { clearAllConversations } from "@/lib/storage";
import { useRouter } from "expo-router";
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
              fetchOptions: {
                onSuccess: async () => {
                  await clearAllConversations();
                  router.replace("/(auth)/login");
                  onClose();
                },
              },
            });
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
