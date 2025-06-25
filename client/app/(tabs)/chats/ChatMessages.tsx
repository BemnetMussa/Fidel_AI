import React from "react";
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

export type Sender = "user" | "ai";

export interface Message {
  sender: Sender;
  text: string;
  timestamp: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  scrollViewRef: React.RefObject<ScrollView | null>;
}

export default function ChatMessages({
  messages,
  isLoading,
  scrollViewRef,
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

  // Theme-aware colors for chat bubbles
  const getUserBubbleStyle = () => ({
    backgroundColor: theme === "light" ? "#A9E991" : "#2f2f2f",
  });

  const getAiBubbleStyle = () => ({
    backgroundColor: theme === "light" ? "white" : "",
  });

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1 py-4 px-2"
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
              {(msg.text || "").trim()}
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
                onPress={() => console.log("Pencil is clicked")}
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
  );
}

const styles = StyleSheet.create({
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
