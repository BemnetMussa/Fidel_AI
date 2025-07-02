import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  ToastAndroid,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import * as Clipboard from "expo-clipboard";
import Icon from "react-native-vector-icons/Ionicons";
import Markdown from "react-native-markdown-display";

export type Sender = "user" | "ai";

export interface Message {
  id?: string;
  sender: Sender;
  text: string;
  timestamp: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isSending: boolean;
  isFetching: boolean;
  scrollViewRef: React.RefObject<ScrollView | null>;
  onScrollTop?: () => void;
}

// Typing indicator component
function TypingIndicator() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Text style={{ color: "#888", fontStyle: "italic" }}>
      ፈደል AI is thinking {dots}
    </Text>
  );
}

export default function ChatMessages({
  messages,
  isSending,
  isFetching,
  scrollViewRef,
  onScrollTop,
}: ChatMessagesProps) {
  const { theme } = useTheme();
  const textColor = Colors[theme].text;

  const handleCopy = (text: string) => {
    Clipboard.setStringAsync(text);
    if (Platform.OS === "android") {
      ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Copied to clipboard!");
    }
  };

  const getUserBubbleStyle = () => ({
    backgroundColor: theme === "light" ? "#A9E991" : "#2f2f2f",
  });

  const getAiBubbleStyle = () => ({
    backgroundColor: theme === "light" ? "white" : "",
  });
  // const getAiBubbleStyle = () => ({
  //   backgroundColor: theme === "light" ? "white" : "#1a1a1a",
  //   borderWidth: theme === "light" ? 1 : 0,
  //   borderColor: theme === "light" ? "#e0e0e0" : "transparent",
  // });

  // Markdown styles based on theme
  const getMarkdownStyles = () => ({
    body: {
      color: textColor,
      fontSize: 16,
      lineHeight: 24,
    },
    heading1: {
      color: textColor,
      fontSize: 24,
      fontWeight: "bold",
      marginTop: 16,
      marginBottom: 8,
    },
    heading2: {
      color: textColor,
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 14,
      marginBottom: 6,
    },
    heading3: {
      color: textColor,
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 12,
      marginBottom: 4,
    },
    paragraph: {
      color: textColor,
      marginBottom: 8,
      lineHeight: 22,
    },
    strong: {
      color: textColor,
      fontWeight: "bold",
    },
    em: {
      color: textColor,
      fontStyle: "italic",
    },
    code_inline: {
      backgroundColor: theme === "light" ? "#f0f0f0" : "#404040",
      color: theme === "light" ? "#e83e8c" : "#ff6b9d",
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
      fontSize: 14,
    },
    code_block: {
      backgroundColor: theme === "light" ? "#f8f9fa" : "#2d2d2d",
      color: theme === "light" ? "#333" : "#f8f9fa",
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
      fontSize: 14,
      borderWidth: 1,
      borderColor: theme === "light" ? "#e9ecef" : "#404040",
    },
    fence: {
      backgroundColor: theme === "light" ? "#f8f9fa" : "#2d2d2d",
      color: theme === "light" ? "#333" : "#f8f9fa",
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
      fontSize: 14,
      borderWidth: 1,
      borderColor: theme === "light" ? "#e9ecef" : "#404040",
    },
    blockquote: {
      backgroundColor: theme === "light" ? "#f8f9fa" : "#2a2a2a",
      borderLeftWidth: 4,
      borderLeftColor: theme === "light" ? "#007bff" : "#4dabf7",
      paddingLeft: 12,
      paddingVertical: 8,
      marginVertical: 8,
      fontStyle: "italic",
    },
    list_item: {
      color: textColor,
      marginBottom: 4,
    },
    bullet_list: {
      marginBottom: 8,
    },
    ordered_list: {
      marginBottom: 8,
    },
    link: {
      color: theme === "light" ? "#007bff" : "#4dabf7",
      textDecorationLine: "underline",
    },
    table: {
      borderWidth: 1,
      borderColor: theme === "light" ? "#dee2e6" : "#495057",
      borderRadius: 4,
      marginVertical: 8,
    },
    thead: {
      backgroundColor: theme === "light" ? "#f8f9fa" : "#343a40",
    },
    tbody: {
      backgroundColor: theme === "light" ? "white" : "#212529",
    },
    th: {
      color: textColor,
      fontWeight: "bold",
      padding: 8,
      borderBottomWidth: 1,
      borderColor: theme === "light" ? "#dee2e6" : "#495057",
    },
    td: {
      color: textColor,
      padding: 8,
      borderBottomWidth: 1,
      borderColor: theme === "light" ? "#dee2e6" : "#495057",
    },
    hr: {
      backgroundColor: theme === "light" ? "#dee2e6" : "#495057",
      height: 1,
      marginVertical: 16,
    },
  });

  const handleScroll = (e: any) => {
    const scrollOffsetY = e.nativeEvent.contentOffset.y;
    if (scrollOffsetY <= 50 && !isFetching) {
      if (onScrollTop) {
        onScrollTop();
      }
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      className="flex-1 py-4 px-1"
      contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {isFetching && (
        <View style={{ marginBottom: 8, alignItems: "center" }}>
          <ActivityIndicator size="small" color="#999" />
        </View>
      )}

      {messages.map((msg, idx) => (
        <View
          key={idx}
          className={`flex-col my-2 ${
            msg.sender === "user" ? "items-end" : "items-start"
          }`}
        >
          <View
            className={`max-w-full px-3 py-3 ${
              msg.sender === "user"
                ? "rounded-l-2xl rounded-r-2xl"
                : "rounded-r-2xl rounded-tl-2xl rounded-bl-md"
            }`}
            style={[
              msg.sender === "user"
                ? { ...styles.userBubble, ...getUserBubbleStyle() }
                : { ...styles.aiBubble, ...getAiBubbleStyle() },
            ]}
          >
            {msg.sender === "user" ? (
              <Text
                style={{
                  color: theme === "light" ? "#000000" : "white",
                  fontSize: 16,
                  lineHeight: 22,
                }}
              >
                {(msg.text || "").trim()}
              </Text>
            ) : (
              <Markdown style={getMarkdownStyles()}>{msg.text || ""}</Markdown>
            )}
          </View>

          <View className="flex-row mt-1">
            <TouchableOpacity
              onPress={() => handleCopy(msg.text)}
              className={`${
                msg.sender === "user" ? "self-end pr-2" : "self-start pl-2"
              }`}
            >
              <Icon
                name="copy-outline"
                size={13}
                color={theme === "light" ? "#666" : "#999"}
              />
            </TouchableOpacity>

            {msg.sender === "user" ? (
              <TouchableOpacity
                onPress={() => console.log("Edit message")}
                className="self-end pr-2"
              >
                <Icon
                  name="pencil-outline"
                  size={13}
                  color={theme === "light" ? "#666" : "#999"}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => console.log("Read aloud")}
                className="self-start pl-2"
              >
                <Icon
                  name="volume-high-outline"
                  size={14}
                  color={theme === "light" ? "#666" : "#999"}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}

      {isSending && (
        <View className="flex-row justify-start my-2">
          <View
            className="rounded-r-2xl rounded-tl-2xl rounded-bl-md px-4 py-3"
            style={getAiBubbleStyle()}
          >
            <TypingIndicator />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  userBubble: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  aiBubble: {
  //   shadowColor: "#383838",
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 0.41,
  //   elevation: 3,
  },
});
