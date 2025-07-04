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
                  onClose(); // close any modal or drawer
                  setTimeout(() => {
                    router.replace("/(auth)/login"); // navigate after UI stabilizes
                  }, 50);
                },
              },
            });
          } catch (error) {
            console.log("Error logging out:", error);
            (global as any).showAppToast({
              message: "Failed to logout. Try again!",
              type: "error",
              duration: 3000,
            });
          }
        },
      },
    ]);
  };

  return handleLogout;
};
