import { Conversation } from "@/app/(tabs)/chats/SideDrawer";
import { baseURL } from "@/lib/auth-client";
import axios from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";

interface ClearConversationsProps {
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  onClose: () => void;
}

export const handleClearConversations = async ({
  setConversations,
  onClose,
}: ClearConversationsProps) => {
  Alert.alert(
    "Clear All Conversations",
    "Are you sure you want to delete all conversations?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await axios.delete(`${baseURL}/api/conversation`, {
              withCredentials: true,
            });

            if (!response || response.status !== 200) {
              console.log("Error deleting conversations");
              Alert.alert("Error", "Something went wrong while deleting.");
              return;
            }

            console.log("Conversations deleted:", response.data);

            // Clear conversations
            setConversations([]);

            // Navigate to chats page
            router.replace("/chats");

            // Delay closing the drawer slightly to allow the UI to re-render
            setTimeout(() => {
              onClose();
            }, 100);
          } catch (error) {
            console.error("Error clearing conversations:", error);
            Alert.alert("Error", "Failed to clear conversations.");
          }
        },
      },
    ]
  );
};
