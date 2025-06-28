import React, { useEffect, useState, ReactNode } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NavBar from "./NavBar";
import { useTheme } from "@/contexts/ThemeContext";
import { Colors } from "@/constants/Colors";

interface ChatLayoutProps {
  children: ReactNode;
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

export default function ChatLayout({
  children,
  input,
  setInput,
  onSendMessage,
  isLoading,
}: ChatLayoutProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const textColor = Colors[theme].text;
  const iconColor = Colors[theme].icon;
  const backgroundColor = Colors[theme].background;

  const getInputStyle = () => ({
    backgroundColor: theme === "light" ? "#F9FAFB" : "#2f2f2f",
    borderColor: theme === "light" ? "#D1D5DB" : "#4B5563", // Fixed typo: was "#4B556"
    color: textColor,
  });

  const getInputContainerStyle = () => ({
    backgroundColor: backgroundColor,
    borderTopColor: theme === "light" ? "#D1D5DB" : "#374151",
  });

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
      {/* NavBar */}
      <NavBar />

      {/* Main Content with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 10}
      >
        {/* Chat Content Area */}
        <View style={{ flex: 1 }}>{children}</View>

        {/* Input Section */}
        <View
          className="border-t"
          style={[
            styles.inputContainer,
            getInputContainerStyle(),
            { paddingBottom: insets.bottom }, // 👈 dynamic safe-area padding
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
              onSubmitEditing={onSendMessage}
              editable={!isLoading}
              multiline={true}
              textAlignVertical="top"
            />
            <TouchableOpacity
              onPress={onSendMessage}
              className={`pl-2 ${isLoading ? "opacity-50" : "active:opacity-80"}`}
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
    paddingTop: 2,
  },
});
