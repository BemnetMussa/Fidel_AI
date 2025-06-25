import AsyncStorage from "@react-native-async-storage/async-storage";

import { Message } from "../app/(tabs)/chats/ChatMessages";
import { Conversation } from "@/app/(tabs)/chats/SideDrawer";

const STORAGE_KEY = "chat_messages";

// this logic save message in async-storage
export const saveMessages = async (messages: Message[]) => {
  try {
    const savedMes = await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messages)
    );

    console.log("get cached message is calling:", savedMes);
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

    console.log("get cached message is calling:", parsed);

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
    const savedCon = await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(conversation)
    );

    console.log(savedCon);
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

    console.log("get cached conversation is calling:", parsed);

    return parsed as Conversation[];
  } catch (error) {
    console.error("Failed to get conversation", error);
    return [];
  }
};
