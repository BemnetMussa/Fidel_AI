import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios, { isAxiosError } from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "./NavBar";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";

// Add your Gemini API key here
const GEMINI_API_KEY = "AIzaSyDZ_jY2AD0z5JLiIdDYPqt7sH_fxc9WQtI";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function ChatView() {
  const { chatId } = useLocalSearchParams();
  const { theme } = useTheme();

  const backgroundColor = Colors[theme].background;
  const textColor = Colors[theme].text;
  const iconColor = Colors[theme].icon;
  const tintColor = Colors[theme].tint;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessageToGemini = async (userMessage: string) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        GEMINI_API_URL,
        {
          contents: [{ parts: [{ text: userMessage }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 30000, // 30 second timeout
        }
      );

      if (
        response.data.candidates &&
        response.data.candidates[0]?.content?.parts?.[0]?.text
      ) {
        const aiResponse = response.data.candidates[0].content.parts[0].text;

        // Add AI response to messages
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: aiResponse,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        throw new Error("Invalid response from Gemini API");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);

      let errorMessage =
        "Sorry, I'm having trouble responding right now. Please try again.";

      // Type guard for axios errors
      if (isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          errorMessage =
            "Request timed out. Please check your connection and try again.";
        } else if (error.response?.status === 429) {
          errorMessage =
            "Too many requests. Please wait a moment and try again.";
        } else if (error.response?.status === 401) {
          errorMessage = "Authentication failed. Please check your API key.";
        } else if (error.response?.status === 403) {
          errorMessage = "Access forbidden. Please check your API permissions.";
        } else if (error.response && error.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);

      // OPTIONAL: Add error message
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: errorMessage,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = input.trim();

      const newUserMessage: Message = {
        sender: "user",
        text: userMessage,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setInput("");

      await sendMessageToGemini(userMessage);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

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

  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        text: "Hi! I'm your AI assistant powered by Gemini. How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  // Theme-aware colors for chat bubbles
  const getUserBubbleStyle = () => ({
    backgroundColor: tintColor,
  });

  const getAiBubbleStyle = () => ({
    backgroundColor: theme === "light" ? "#F3F4F6" : "#374151",
  });

  const getInputContainerStyle = () => ({
    backgroundColor: backgroundColor,
    borderTopColor: theme === "light" ? "#D1D5DB" : "#374151",
  });

  const getInputStyle = () => ({
    backgroundColor: theme === "light" ? "#F9FAFB" : "#1F2937",
    borderColor: theme === "light" ? "#D1D5DB" : "#4B5563",
    color: textColor,
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
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 py-4 px-2 mb-16"
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, idx) => (
            <View
              key={idx}
              className={`flex-row my-1 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <View
                className={`max-w-[80%] px-4 py-3 ${
                  msg.sender === "user"
                    ? "rounded-l-xl rounded-tr-xl"
                    : "rounded-r-xl rounded-tl-xl"
                }`}
                style={[
                  msg.sender === "user"
                    ? { ...styles.userBubble, ...getUserBubbleStyle() }
                    : { ...styles.aiBubble, ...getAiBubbleStyle() },
                ]}
              >
                <Text
                  style={{
                    color:
                      msg.sender === "user"
                        ? theme === "light"
                          ? "#FFFFFF"
                          : "#000000"
                        : textColor,
                  }}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          {isLoading && (
            <View className="flex-row justify-start my-1">
              <View
                className="rounded-r-2xl rounded-tl-2xl rounded-bl-md px-4 py-3"
                style={getAiBubbleStyle()}
              >
                <ActivityIndicator
                  size="small"
                  color={theme === "light" ? "#666" : "#9BA1A6"}
                />
              </View>
            </View>
          )}
        </ScrollView>

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
              style={getInputStyle()}
              placeholder="Ask anything..."
              placeholderTextColor={iconColor}
              value={input}
              onChangeText={setInput}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={sendMessage}
              className={`pl-2 ${isLoading ? "opacity-50" : "active:opacity-80"} `}
              disabled={isLoading}
            >
              <MaterialCommunityIcons
                name="send"
                size={20}
                color={isLoading ? iconColor : theme === "light" ? "black" : "white"}
              />
            </TouchableOpacity>
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
  },
  aiBubble: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
