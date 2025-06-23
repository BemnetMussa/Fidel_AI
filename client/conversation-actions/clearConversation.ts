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
            const response = await axios.get(`${baseURL}/api/conversation`, {
              withCredentials: true,
            });

            const conversations: Conversation[] = response.data.converstation;

            for (const conversation of conversations) {
              try {
                console.log("Deleting conversation:", conversation.id);
                const response = await axios.delete(
                  `${baseURL}/api/conversation/${conversation.id}`,
                  {
                    withCredentials: true,
                  }
                );

                console.log(response);
              } catch (err) {
                console.error(
                  `Failed to delete conversation ${conversation.id}:`,
                  err
                );
              }
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
