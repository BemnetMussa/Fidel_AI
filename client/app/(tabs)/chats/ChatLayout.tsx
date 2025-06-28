import React, { useEffect, useState, ReactNode } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Keyboard,
  StyleSheet,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, usePathname } from "expo-router";
import axios from "axios";
import NavBar from "./NavBar";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";
import { authClient, baseURL } from "@/lib/auth-client";
import { saveConversation, getCachedConversation } from "@/lib/storage";

interface ChatLayoutProps {
  children: ReactNode;
  input: string;
  setInput: (value: string) => void;
  onSendMessage: (conversationId: string, message: string) => void; // Updated to include conversationId and message
  isLoading: boolean;
  currentConversationId?: string | null;
  setCurrentConversationId?: (id: string) => void; // Add setter for conversation ID
}

interface Conversation {
  id: number;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function ChatLayout({
  children,
  input,
  setInput,
  onSendMessage,
  isLoading,
  currentConversationId,
  setCurrentConversationId,
}: ChatLayoutProps) {
  const [keyboardHeight] = useState(new Animated.Value(0));
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const textColor = Colors[theme].text;
  const iconColor = Colors[theme].icon;
  const backgroundColor = Colors[theme].background;

  const getInputStyle = () => ({
    backgroundColor: theme === "light" ? "#F9FAFB" : "#2f2f2f",
    borderColor: theme === "light" ? "#D1D5DB" : "#4B5563",
    color: textColor,
  });

  const getInputContainerStyle = () => ({
    backgroundColor: backgroundColor,
    borderTopColor: theme === "light" ? "#D1D5DB" : "#374151",
  });

  // Create new conversation function
  const createNewConversation = async (
    messageToSend: string
  ): Promise<string | null> => {
    if (isCreatingConversation) return null;

    try {
      setIsCreatingConversation(true);
      console.log("Creating new conversation automatically");

      const { data: session } = await authClient.getSession();

      const response = await axios.post(
        `${baseURL}/api/conversation`,
        { title: "New Chat" },
        {
          withCredentials: true,
        }
      );

      const { chat: newConversation } = response.data;

      if (!newConversation?.id) {
        throw new Error("Conversation ID missing from server response");
      }

      // Update cached conversations
      const cachedConversations = await getCachedConversation();
      const updatedConversations = [newConversation, ...cachedConversations];
      await saveConversation(updatedConversations);

      const conversationId = newConversation.id.toString();

      // Update the current conversation ID in parent component
      if (setCurrentConversationId) {
        setCurrentConversationId(conversationId);
      }

      // Update the URL without navigation to maintain state
      if (pathname === "/" || pathname === "/home") {
        // Use replace to update URL without losing state
        router.replace({
          pathname: "/chats/[chatId]",
          params: { chatId: conversationId },
        });
      }

      // Now send the message to the newly created conversation
      onSendMessage(conversationId, messageToSend);

      return conversationId;
    } catch (error) {
      console.error("Error creating conversation:", error);
      return null;
    } finally {
      setIsCreatingConversation(false);
    }
  };

  // Enhanced send message handler
  const handleSendMessage = async () => {
    const messageToSend = input.trim();
    if (!messageToSend) return;

    // Clear input immediately to provide instant feedback
    setInput("");

    // If there's no current conversation, create one and send the message
    if (!currentConversationId && !isCreatingConversation) {
      await createNewConversation(messageToSend);
      return;
    }

    // If we have a conversation ID, proceed with sending normally
    if (currentConversationId) {
      onSendMessage(currentConversationId, messageToSend);
    }
  };

  // Manual keyboard handling with animation
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        Animated.timing(keyboardHeight, {
          toValue:
            event.endCoordinates.height -
            (Platform.OS === "ios" ? insets.bottom : 0),
          duration: Platform.OS === "ios" ? event.duration : 250,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (event) => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: Platform.OS === "ios" ? event.duration : 250,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, [insets.bottom]);

  const isSendDisabled = isLoading || isCreatingConversation || !input.trim();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
      {/* NavBar */}
      <NavBar />

      {/* Chat Content Area */}
      <View style={{ flex: 1 }}>{children}</View>

      {/* Input Section with Manual Keyboard Handling */}
      <Animated.View
        className="border-t"
        style={[
          styles.inputContainer,
          getInputContainerStyle(),
          {
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            marginBottom: keyboardHeight,
          },
        ]}
      >
        <View className="flex-row items-center p-3">
          <TextInput
            className="flex-1 px-3 py-2 rounded-md border"
            style={[getInputStyle(), { maxHeight: 70 }]}
            placeholder="Ask anything..."
            placeholderTextColor={iconColor}
            value={input}
            onChangeText={setInput}
            returnKeyType="send"
            onSubmitEditing={handleSendMessage}
            editable={!isLoading && !isCreatingConversation}
            multiline={true}
            textAlignVertical="top"
            blurOnSubmit={false}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            className={`pl-2 ${isSendDisabled ? "opacity-50" : "active:opacity-80"}`}
            disabled={isSendDisabled}
            style={styles.sendButton}
          >
            <MaterialCommunityIcons
              name="send"
              size={20}
              color={
                isSendDisabled
                  ? iconColor
                  : theme === "light"
                    ? "black"
                    : "white"
              }
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingTop: 2,
  },
  sendButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
