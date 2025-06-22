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
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "./NavBar";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import * as Clipboard from "expo-clipboard";
import Icon from "react-native-vector-icons/Ionicons";

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
  const [conversationId, setConversationId] = useState<string | null>(null);

  const sendMessageToGemini = async (userMessage: string) => {
    try {
      setIsLoading(true);
      console.log("Sending message to Gemini:", userMessage);

      const response = await axios.post(
        conversationId
          ? `http://192.168.107.60:3000/api/message/${conversationId}`
          : `http://192.168.107.60:3000/api/message`,
        { content: userMessage },
        { withCredentials: true }
      );

      const {
        aiMessage,
        userMessage: savedUserMessage,
        conversationId: returnedId,
      } = response.data;

      // Store new conversationId
      if (!conversationId && returnedId) {
        console.log("New conversationId:", returnedId);
        setConversationId(returnedId.toString());
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: savedUserMessage.content,
          timestamp: savedUserMessage.createdAt,
        },
        {
          sender: "ai",
          text: aiMessage.content,
          timestamp: aiMessage.createdAt,
        },
      ]);
    } catch (error) {
      console.error("Error calling backend:", error);
      Alert.alert("Error", "Failed to send message. Try again.");
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

  const handleCopy = (text: string) => {
    Clipboard.setStringAsync(text);
    if (Platform.OS === "android") {
      ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Copied to clipboard!");
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
    backgroundColor: theme === "light" ? "#A9E991" : "#2f2f2f",
  });

  const getAiBubbleStyle = () => ({
    backgroundColor: theme === "light" ? "white" : "",
  });

  const getInputContainerStyle = () => ({
    backgroundColor: backgroundColor,
    borderTopColor: theme === "light" ? "#D1D5DB" : "#374151",
  });

  const getInputStyle = () => ({
    backgroundColor: theme === "light" ? "#F9FAFB" : "#2f2f2f",
    borderColor: theme === "light" ? "#D1D5DB" : "#4B556",
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
              className={`flex-col my-1 ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <View
                className={`max-w-[95%] px-2 py-3 ${
                  msg.sender === "user" ? "rounded-l-2xl rounded-r-2xl" : ""
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
                          ? "#000000"
                          : "white"
                        : textColor,
                  }}
                >
                  {msg.text.trim()}
                </Text>
              </View>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => handleCopy(msg.text)}
                  className={` ${msg.sender === "user" ? "mt-2 self-end pr-2" : "self-start pl-2"}`}
                >
                  <Icon
                    name="copy-outline"
                    size={13}
                    color={theme === "light" ? "black" : "white"}
                  />
                </TouchableOpacity>
                {msg.sender === "user" ? (
                  <TouchableOpacity
                    onPress={() => console.log("Speaker is clicked")}
                    className="mt-2 self-end pr-2"
                  >
                    <Icon
                      name="pencil-outline"
                      size={13}
                      color={theme === "light" ? "black" : "white"}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => console.log("Speaker is clicked")}
                    className="self-start pl-2"
                  >
                    <Icon
                      name="volume-high-outline"
                      size={14}
                      color={theme === "light" ? "black" : "white"}
                    />
                  </TouchableOpacity>
                )}
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
                  isLoading ? iconColor : theme === "light" ? "black" : "white"
                }
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
