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
  const [keyboardHeight] = useState(new Animated.Value(0));
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

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
            marginBottom: keyboardHeight, // This moves the input up with keyboard
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
            onSubmitEditing={onSendMessage}
            editable={!isLoading}
            multiline={true}
            textAlignVertical="top"
            blurOnSubmit={false}
          />
          <TouchableOpacity
            onPress={onSendMessage}
            className={`pl-2 ${isLoading ? "opacity-50" : "active:opacity-80"}`}
            disabled={isLoading}
            style={styles.sendButton}
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
