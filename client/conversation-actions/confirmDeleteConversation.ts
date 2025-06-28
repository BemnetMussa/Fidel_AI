import { Conversation } from "@/app/(tabs)/chats/SideDrawer";
import { baseURL } from "@/lib/auth-client";
import { deleteConversationById, getCachedConversation } from "@/lib/storage";
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
            console.log("delete conversation", conversation);
            console.log("delete conversation id", conversation.id);
            await axios.delete(
              `${baseURL}/api/conversation/${conversation.id}`,
              {
                withCredentials: true,
              }
            );

            await deleteConversationById(conversation.id);
            setConversations((prev) =>
              prev.filter((c) => c.id !== conversation.id)
            );
            await getCachedConversation();
          } catch (error) {
            console.error("Error deleting conversation:", error);
            Alert.alert("Error", "Failed to delete conversation.");
          }
        },
      },
    ]
  );
};
