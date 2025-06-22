import { baseURL } from "@/lib/auth-client";
import axios from "axios";
import { Alert } from "react-native";
import { Conversation } from "@/app/(tabs)/chats/SideDrawer";

interface promptProps {
  conversation: Conversation;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
}

export const promptRenameConversation = async ({
  conversation,
  setConversations,
}: promptProps) => {
  Alert.prompt(
    "Rename Conversation",
    "Enter new title",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Save",
        onPress: async (newTitle) => {
          if (newTitle?.trim()) {
            try {
              // const token = await AsyncStorage.getItem("jwtToken");
              await axios.put(
                `${baseURL}/api/conversations/${conversation.id}`,
                { title: newTitle.trim() },
                {
                  // headers: { Authorization: `Bearer ${token}` },
                  withCredentials: true,
                }
              );
              setConversations((prev) =>
                prev.map((c) =>
                  c.id === conversation.id
                    ? { ...c, title: newTitle.trim() }
                    : c
                )
              );
            } catch (error) {
              console.error("Error renaming conversation:", error);
              Alert.alert("Error", "Failed to rename conversation.");
            }
          }
        },
      },
    ],
    "plain-text",
    conversation.title
  );
};
