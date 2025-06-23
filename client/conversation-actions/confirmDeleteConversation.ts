import { Conversation } from "@/app/(tabs)/chats/SideDrawer";
import { baseURL } from "@/lib/auth-client";
import axios from "axios";
import { Alert } from "react-native";

interface ConfirmDeleteProps {
  conversation: Conversation;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
}

export const confirmDeleteConversation = async ({
  conversation,
  setConversations,
}: ConfirmDeleteProps) => {
  Alert.alert(
    "Delete Conversation",
    "Are you sure you want to delete this conversation?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // const token = await AsyncStorage.getItem("jwtToken");
            await axios.delete(
              `${baseURL}/api/conversations/${conversation.id}`,
              {
                // headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
              }
            );
            setConversations((prev) =>
              prev.filter((c) => c.id !== conversation.id)
            );
          } catch (error) {
            console.error("Error deleting conversation:", error);
            Alert.alert("Error", "Failed to delete conversation.");
          }
        },
      },
    ]
  );
};
