import AsyncStorage from "@react-native-async-storage/async-storage";
import { Message } from "../app/(tabs)/chats/ChatMessages";
import { Conversation } from "@/app/(tabs)/chats/SideDrawer";

// Keys
const MESSAGE_KEY = "chat_messages";
const CONVERSATION_KEY = "chat_conversations";

// Save messages
export const saveMessages = async (messages: Message[]) => {
  try {
    const existing = await getCachedMessages();
    const merged = [
      ...existing,
      ...messages.filter((msg) => !existing.find((m) => m.id === msg.id)),
    ];

    await AsyncStorage.setItem(MESSAGE_KEY, JSON.stringify(merged));
    console.log("Messages saved.");
  } catch (error) {
    console.error("Failed to save messages:", error);
  }
};

// Get cached messages
export const getCachedMessages = async (): Promise<Message[]> => {
  try {
    const json = await AsyncStorage.getItem(MESSAGE_KEY);
    if (!json) return [];

    const parsed = JSON.parse(json) as Message[];

    return parsed.map((m) => ({
      ...m,
      sender: m.sender === "user" ? "user" : "ai",
    }));
  } catch (error) {
    console.error("Failed to get messages:", error);
    return [];
  }
};

// Save conversations (merge without duplication)
export const saveConversation = async (newConversations: Conversation[]) => {
  try {
    const existing = await getCachedConversation();

    // Merge and prevent duplication by ID
    const merged = [
      ...newConversations,
      ...existing.filter((e) => !newConversations.some((n) => n.id === e.id)),
    ];

    await AsyncStorage.setItem(CONVERSATION_KEY, JSON.stringify(merged));
    console.log("Conversations saved.");
  } catch (error) {
    console.error("Failed to save conversations:", error);
  }
};

// Get cached conversations
export const getCachedConversation = async (): Promise<Conversation[]> => {
  try {
    const json = await AsyncStorage.getItem(CONVERSATION_KEY);
    if (!json) return [];

    const parsed = JSON.parse(json) as Conversation[];
    console.log("conversation was fetched form asnyc-storage", parsed);
    return parsed;
  } catch (error) {
    console.error("Failed to get conversations:", error);
    return [];
  }
};
