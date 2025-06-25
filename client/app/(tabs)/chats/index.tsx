import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NavBar from "./NavBar";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import { baseURL } from "@/lib/auth-client";
import { router } from "expo-router";

export interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { theme } = useTheme();
  const textColor = Colors[theme].text;
  const iconColor = Colors[theme].icon;
  const backgroundColor = Colors[theme].background;

  const getInputStyle = () => ({
    backgroundColor: theme === "light" ? "#F9FAFB" : "#2f2f2f",
    borderColor: theme === "light" ? "#D1D5DB" : "#4B556",
    color: textColor,
  });

  const sendMessageToCreateNewConversation = async (userMessage: string) => {
    try {
      setIsLoading(true);
      console.log("Sending message to Gemini:", userMessage);

      const response = await axios.post(
        `${baseURL}/api/message`,
        { content: userMessage },
        { withCredentials: true }
      );

      const newChatId: string = response.data.conversationId;

      if (!newChatId) throw new Error("No new chat ID returned from server");

      router.push({
        pathname: "/chats/[chatId]",
        params: { chatId: newChatId },
      });
    } catch (error) {
      console.error("Error calling backend:", error);
      Alert.alert("Error", "Failed to send message. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    console.log("sending message");
    if (input.trim()) {
      const userMessage = input.trim();

      const newUserMessage: Message = {
        sender: "user",
        text: userMessage,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setInput("");

      await sendMessageToCreateNewConversation(userMessage);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const getInputContainerStyle = () => ({
    backgroundColor: backgroundColor,
    borderTopColor: theme === "light" ? "#D1D5DB" : "#374151",
  });

  return (
    <SafeAreaView
      style={{ backgroundColor: backgroundColor }}
      className="flex-1"
    >
      <NavBar />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        style={{ flex: 1 }}
      >
        {/* Main Content Area */}
        <View className="flex-1 bg-white mx-4 mt-2 rounded-t-3xl px-6 py-8">
          {/* Center Message */}
          <View className="flex-1 justify-center items-center">
            <Text className="text-2xl font-bold text-black text-center mb-4">
              ወደ pAI እንኳን ደህና{"\n"}መጡ።
            </Text>
          </View>

          {/* Bottom Section */}
          <View className="mb-8">
            <View className="mb-6">
              <Text className="text-sm text-gray-600 mb-2">
                የወጣቶች ቤት መጽሐፍ ጉዳይ
              </Text>
              <Text className="text-xs text-gray-500 mb-4">
                ለወጣቶች ቤት ሰዎች ቤተ መጽሐፍ{"\n"}ሀ ዳ ዓመት ልክ ስለ
              </Text>

              <Text className="text-sm text-gray-600 mb-2">አውቶማቲክ አሰራር</Text>
              <Text className="text-xs text-gray-500">ሀ ዳ ዓመት ልክ ስለ</Text>
            </View>
            {/* Input Field */}
            <View
              className="border-t px-4"
              style={[
                styles.inputContainer,
                getInputContainerStyle(),
                Platform.OS === "android" &&
                  keyboardHeight > 0 && {
                    bottom: keyboardHeight,
                  },
              ]}
            >
              <View className="flex-row items-center space-x-3">
                <TextInput
                  className="flex-1 px-3 py-2 rounded-md border"
                  style={[getInputStyle(), { maxHeight: 70 }]}
                  placeholder="Ask anything..."
                  placeholderTextColor={iconColor}
                  value={input}
                  onChangeText={setInput}
                  returnKeyType="send"
                  onSubmitEditing={sendMessage}
                  editable={!isLoading}
                  multiline={true}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  onPress={sendMessage}
                  className={`pl-2 ${isLoading ? "opacity-50" : "active:opacity-80"} `}
                  disabled={isLoading}
                >
                  <MaterialCommunityIcons
                    name="send"
                    size={20}
                    color={
                      isLoading
                        ? iconColor
                        : theme === "light"
                          ? "black"
                          : "white"
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 12,
    position: Platform.OS === "android" ? "absolute" : "relative",
    bottom: 0,
    left: 0,
    right: 0,
  },
  userBubble: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    color: "white",
  },
  aiBubble: {
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.15,
    // shadowRadius: 1.41,
    // elevation: 2,
  },
});
