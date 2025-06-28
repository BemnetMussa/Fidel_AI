import React, { useState } from "react";
import { Alert, View, Text } from "react-native";
import axios from "axios";
import { baseURL } from "@/lib/auth-client";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import ChatLayout from "./ChatLayout";
import CardSlider from "./CardSlider";
import { saveConversation, saveMessages } from "@/lib/storage";
import { Conversation } from "./SideDrawer";
import { Message } from "./ChatMessages";

export default function Welcome() {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const { theme } = useTheme();
  const backgroundColor = Colors[theme].background;
  const textColor = Colors[theme].text;

  const sendMessageToCreateNewConversation = async (userMessage: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${baseURL}/api/message`,
        { content: userMessage },
        { withCredentials: true }
      );

      const newChatId: string = response.data.conversationId;
      if (!newChatId) throw new Error("No new chat ID returned from server");

      const conversation: Conversation = response.data.conversation;
      const messages: Message[] = response.data.message
        ? [response.data.message]
        : response.data.messages;

      await saveMessages(newChatId, messages);
      await saveConversation([conversation]);

      router.push({
        pathname: "/chats/[chatId]",
        params: { chatId: newChatId },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to send message. Try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = input.trim();
      setInput("");
      await sendMessageToCreateNewConversation(userMessage);
    }
  };

  return (
    <ChatLayout
      input={input}
      setInput={setInput}
      onSendMessage={sendMessage}
      isLoading={isLoading}
    >
      <View className="flex-1 mx-4 rounded-t-3xl px-6">
        {/* Centered Welcome Message */}
        <View className="flex-1 justify-center items-center">
          <Text
            className={`text-5xl ${theme === "dark" ? "text-white" : "text-black"} font-extrabold text-center mb-4`}
          >
            Welcome to pAI{/* ወደ pAI እንኳን ደህና{"\n"}መጡ። */}
          </Text>
        </View>

        {/* Bottom Section
        <View className="mb-8">
          <View className="mb-6">
            <Text className="text-sm mb-2">የወጣቶች ቤት መጽሐፍ ጉዳይ</Text>
            <Text className="text-xs mb-4">
              ለወጣቶች ቤት ሰዎች ቤተ መጽሐፍ{"\n"}ሀ ዳ ዓመት ልክ ስለ
            </Text>

            <Text className="text-sm mb-2">አውቶማቲክ አሰራር</Text>
            <Text className="text-xs">ሀ ዳ ዓመት ልክ ስለ</Text>
          </View>

        </View> */}
      </View>
      {/* CardSlider placed here below the bottom section */}
      <CardSlider />
    </ChatLayout>
  );
}
