import AsyncStorage from "@react-native-async-storage/async-storage";

import { Message } from "../app/(tabs)/chats/ChatMessages";

const STORAGE_KEY = "chat_messages";

export const saveMessages = async (messages: Message[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Failed to save messages:", error);
  }
};

export const getCachedMessages = async (): Promise<Message[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];

    const parsed = JSON.parse(json) as Message[];

    // Normalize sender values
    return parsed.map((m) => ({
      ...m,
      sender: m.sender === "user" ? "user" : "ai", // default fallback
    }));
  } catch (error) {
    console.error("Failed to get messages:", error);
    return [];
  }
};
