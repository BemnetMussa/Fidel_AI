import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";

const { width: screenWidth } = Dimensions.get("window");
const DRAWER_WIDTH = screenWidth * 0.75; // 75% of screen width

interface Chat {
  id: string;
  title: string;
  lastMessage?: string;
  updatedAt: Date;
}

interface SideDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
}

const SideDrawer: React.FC<SideDrawerProps> = ({
  isVisible,
  onClose,
  slideAnim,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  const backgroundColor = Colors[theme].background;
  const textColor = Colors[theme].text;
  const iconColor = Colors[theme].icon;

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    setLoading(true);
    try {
      // Dummy data - replace with actual API call
      const mockChats: Chat[] = [
        {
          id: "1",
          title: "What is coding?",
          lastMessage: "Coding is the process of creating instructions...",
          updatedAt: new Date(),
        },
        {
          id: "2",
          title: "What is programming?",
          lastMessage: "Programming involves writing code...",
          updatedAt: new Date(),
        },
      ];

      // Simulate API delay
      setTimeout(() => {
        setChats(mockChats);
        setLoading(false);
      }, 500);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/chats');
      // const chatsData = await response.json();
      // setChats(chatsData);
    } catch (error) {
      console.error("Error loading chats:", error);
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    console.log("Creating new chat");
    // TODO: Create new chat and add to state
    onClose();
  };

  const handleChatPress = (chat: Chat) => {
    console.log(`Opening chat: ${chat.title}`);
    // TODO: Navigate to chat or load chat messages
    onClose();
  };

  const handleChatOptions = (chat: Chat) => {
    console.log(`Opening options for chat: ${chat.title}`);
    // TODO: Show chat options (rename, delete, etc.)
  };

  const handleClearConversations = () => {
    console.log("Clearing conversations");
    setChats([]); 
    // TODO: Call API to clear conversations
    onClose();
  };

  const handleUpgradeToPlus = () => {
    console.log("Upgrading to Plus");
    onClose();
  };

  const handleUpdatesAndFAQ = () => {
    console.log("Opening Updates & FAQ");
    onClose();
  };

  const handleLogout = () => {
    console.log("Logging out");
    onClose();
  };

  const renderChatItem = (chat: Chat) => (
    <TouchableOpacity
      key={chat.id}
      onPress={() => handleChatPress(chat)}
      className="flex-row items-center justify-between px-4 py-3"
    >
      <View className="flex-row items-center flex-1">
        <Icon name="message-circle" size={16} color={iconColor} />
        <Text
          style={{ color: textColor }}
          className="ml-3 text-base flex-1"
          numberOfLines={1}
        >
          {chat.title}
        </Text>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity
          className="p-1 mr-2"
          onPress={() => handleChatOptions(chat)}
        >
          <Icon name="more-horizontal" size={16} color={iconColor} />
        </TouchableOpacity>
        <Icon name="chevron-right" size={14} color={iconColor} />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      {isVisible && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            opacity: slideAnim,
            zIndex: 40,
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={onClose}
            style={{ flex: 1 }}
          />
        </Animated.View>
      )}

      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: DRAWER_WIDTH,
          backgroundColor: backgroundColor,
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-DRAWER_WIDTH, 0],
              }),
            },
          ],
          zIndex: 50,
          shadowColor: "#000",
          shadowOffset: {
            width: 2,
            height: 0,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <TouchableOpacity
              onPress={handleNewChat}
              style={{
                borderBottomColor: theme === "light" ? "#E5E7EB" : "#374151",
              }}
              className="flex-row items-center justify-between px-4 py-4 border-b"
            >
              <View className="flex-row items-center">
                <Icon name="message-square" size={20} color={iconColor} />
                <Text style={{ color: textColor }} className="ml-3 text-base">
                  New Chat
                </Text>
              </View>
              <Icon name="chevron-right" size={16} color={iconColor} />
            </TouchableOpacity>

            <View className="py-2">
              <Text
                style={{ color: iconColor }}
                className="px-4 py-2 text-sm font-medium uppercase tracking-wide"
              >
                Chats
              </Text>

              {loading ? (
                <View className="px-4 py-3">
                  <Text style={{ color: iconColor }} className="text-sm">
                    Loading chats...
                  </Text>
                </View>
              ) : chats.length > 0 ? (
                chats.map(renderChatItem)
              ) : (
                <View className="px-4 py-3">
                  <Text style={{ color: iconColor }} className="text-sm">
                    No chats yet. Start a new conversation!
                  </Text>
                </View>
              )}
            </View>

            <View style={{ flex: 1 }} />

            <View
              style={{
                borderTopColor: theme === "light" ? "#E5E7EB" : "#374151",
              }}
              className="border-t pt-2"
            >
              <TouchableOpacity
                onPress={handleClearConversations}
                className="flex-row items-center px-4 py-3"
              >
                <Icon name="trash-2" size={18} color={iconColor} />
                <Text style={{ color: textColor }} className="ml-3 text-base">
                  Clear conversations
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpgradeToPlus}
                className="flex-row items-center justify-between px-4 py-3"
              >
                <View className="flex-row items-center">
                  <Icon name="user" size={18} color={iconColor} />
                  <Text style={{ color: textColor }} className="ml-3 text-base">
                    Upgrade to Plus
                  </Text>
                </View>
                <View
                  style={{ backgroundColor: "#FCD34D" }}
                  className="px-2 py-1 rounded"
                >
                  <Text className="text-xs font-semibold text-black">NEW</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={toggleTheme}
                className="flex-row items-center px-4 py-3"
              >
                <Icon
                  name={theme === "light" ? "moon" : "sun"}
                  size={18}
                  color={iconColor}
                />
                <Text style={{ color: textColor }} className="ml-3 text-base">
                  {theme === "light" ? "Dark" : "Light"} mode
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdatesAndFAQ}
                className="flex-row items-center px-4 py-3"
              >
                <Icon name="help-circle" size={18} color={iconColor} />
                <Text style={{ color: textColor }} className="ml-3 text-base">
                  Updates & FAQ
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                className="flex-row items-center px-4 py-3"
              >
                <Icon name="log-out" size={18} color="#EF4444" />
                <Text className="ml-3 text-base text-red-500">Logout</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </>
  );
};

export default SideDrawer;
