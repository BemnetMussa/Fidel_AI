import AsyncStorage from "@react-native-async-storage/async-storage";
import { Message } from "../app/(tabs)/chats/ChatMessages";
import { Conversation } from "@/app/(tabs)/chats/SideDrawer";

// Optional versioning (good for future upgrades)
const STORAGE_VERSION = "v1";

// Storage keys
const MESSAGE_KEY = `${STORAGE_VERSION}_chat_messages`;
const CONVERSATION_KEY = `${STORAGE_VERSION}_chat_conversations`;

// Save messages for a specific conversation
export const saveMessages = async (
  conversationId: string,
  messages: Message[]
) => {
  try {
    const key = `${MESSAGE_KEY}_${conversationId}`;
    const existing = await getCachedMessages(conversationId);

    const merged = [
      ...existing,
      ...messages.filter(
        (msg) =>
          !existing.find(
            (m) =>
              m.text === msg.text &&
              m.timestamp === msg.timestamp &&
              m.sender === msg.sender
          )
      ),
    ];

    await AsyncStorage.setItem(key, JSON.stringify(merged));
    console.log(`Messages saved for conversation ${conversationId}.`);
  } catch (error) {
    console.error(" Failed to save messages:", error);
  }
};

// Get messages for a specific conversation
export const getCachedMessages = async (
  conversationId: string
): Promise<Message[]> => {
  try {
    const key = `${MESSAGE_KEY}_${conversationId}`;
    const json = await AsyncStorage.getItem(key);
    if (!json) return [];

    const parsed = JSON.parse(json) as Message[];

    return parsed.map((m) => ({
      ...m,
      sender: m.sender === "user" ? "user" : "ai",
    }));
  } catch (error) {
    console.error(" Failed to get messages:", error);
    return [];
  }
};

// Save (merge) conversations
export const saveConversation = async (
  newConversations: Conversation[]
): Promise<void> => {
  try {
    const existing = await getCachedConversation();

    const merged = [
      ...newConversations,
      ...existing.filter((e) => !newConversations.some((n) => n.id === e.id)),
    ];

    await AsyncStorage.setItem(CONVERSATION_KEY, JSON.stringify(merged));
    console.log("Conversations saved.");
  } catch (error) {
    console.error(" Failed to save conversations:", error);
  }
};

// Get all cached conversations
export const getCachedConversation = async (): Promise<Conversation[]> => {
  try {
    const json = await AsyncStorage.getItem(CONVERSATION_KEY);
    if (!json) return [];

    const parsed = JSON.parse(json) as Conversation[];
    console.log("Conversations fetched from AsyncStorage:", parsed);
    return parsed;
  } catch (error) {
    console.error(" Failed to get conversations:", error);
    return [];
  }
};

// Delete specific conversation and its messages
export const deleteConversationById = async (
  conversationId: string
): Promise<void> => {
  try {
    // Remove messages
    await AsyncStorage.removeItem(`${MESSAGE_KEY}_${conversationId}`);

    // Update conversation list
    const existing = await getCachedConversation();
    const updated = existing.filter((conv) => conv.id !== conversationId);

    await AsyncStorage.setItem(CONVERSATION_KEY, JSON.stringify(updated));
    console.log(`Conversation and messages deleted for ID: ${conversationId}`);
  } catch (error) {
    console.error(" Failed to delete conversation:", error);
  }
};

// Clear all messages and conversations (e.g. on logout or reset)
export const clearAllConversations = async (): Promise<void> => {
  try {
    const allConversations = await getCachedConversation();

    // Remove each conversation's messages
    for (const conv of allConversations) {
      await AsyncStorage.removeItem(`${MESSAGE_KEY}_${conv.id}`);
    }

    // Remove the conversation list
    await AsyncStorage.removeItem(CONVERSATION_KEY);
    console.log("All conversations and messages cleared.");
  } catch (error) {
    console.error(" Failed to clear all conversations:", error);
  }
};

// Remove only message cache for a conversation (not the conversation itself)
export const removeMessageCacheOnly = async (
  conversationId: string
): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`${MESSAGE_KEY}_${conversationId}`);
    console.log(`Only messages removed for conversation ${conversationId}`);
  } catch (error) {
    console.error(" Failed to remove message cache:", error);
  }
};
