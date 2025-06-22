import { Conversation } from "@/app/(tabs)/chats/SideDrawer";
import { baseURL } from "@/lib/auth-client";
import axios from "axios";
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
            // const token = await AsyncStorage.getItem("jwtToken");
            const response = await axios.get(`${baseURL}/api/conversations`, {
              // headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            });
            const conversations: Conversation[] = response.data;

            for (const conversation of conversations) {
              await axios.delete(
                `${baseURL}/api/conversations/${conversation.id}`,
                {
                  // headers: { Authorization: `Bearer ${token}` },
                  withCredentials: true,
                }
              );
            }

            setConversations([]);
            onClose();
          } catch (error) {
            console.error("Error clearing conversations:", error);
            Alert.alert("Error", "Failed to clear conversations.");
          }
        },
      },
    ]
  );
};
