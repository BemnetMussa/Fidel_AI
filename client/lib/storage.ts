import AsyncStorage from "@react-native-async-storage/async-storage";

import { Message } from "../app/(tabs)/chats/ChatMessages";
import { Conversation } from "@/app/(tabs)/chats/SideDrawer";
import { jsonParse } from "better-auth/react";

const STORAGE_KEY = "chat_messages";

// this logic save message in async-storage
export const saveMessages = async (messages: Message[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Failed to save messages:", error);
  }
};

// this logic get message in async-storage
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

// save conversation in async-storage
export const saveConversation = async (conversation: Conversation[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(conversation));
  } catch (error) {
    console.error("Failed to save conversation:", error);
  }
};

// get conversation in async-stroage
export const getCachedConversation = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);

    if (!json) return [];

    const parsed = JSON.parse(json) as Conversation[];

    return parsed as Conversation[];
  } catch (error) {
    console.error("Failed to get conversation", error);
    return [];
  }
};
