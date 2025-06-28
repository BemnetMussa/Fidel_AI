import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { baseURL } from "@/lib/auth-client";
import { handleClearConversations } from "@/conversation-actions/clearConversation";
import { confirmDeleteConversation } from "@/conversation-actions/confirmDeleteConversation";
import { useHandleLogout } from "@/conversation-actions/HandleSignOut";
import { renameConversationTitle } from "@/conversation-actions/renameConversation";
import axios from "axios";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { getCachedConversation, saveConversation } from "@/lib/storage";
import FeedbackModal from "./FeedbackModal";

const { width: screenWidth } = Dimensions.get("window");
const DRAWER_WIDTH = screenWidth * 0.75;

interface SideDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
}

export interface Conversation {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const SideDrawer: React.FC<SideDrawerProps> = ({
  isVisible,
  onClose,
  slideAnim,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const backgroundColor = Colors[theme].background;
  const textColor = Colors[theme].text;
  const iconColor = Colors[theme].icon;
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);


  const loadConversations = async () => {
    const cached = await getCachedConversation();
    if (cached.length) setConversations(cached);

    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/conversation`, {
        withCredentials: true,
      });

      const { converstation } = response.data;

      if (Array.isArray(converstation)) {
        const merged = [
          ...converstation,
          ...cached.filter(
            (c) => !converstation.find((f: Conversation) => f.id === c.id)
          ),
        ];
        setConversations(merged);
        await saveConversation(merged);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const handleNewConversation = async () => {
    router.replace("/chats");
  };

  const handleConversationPress = (conversation: Conversation) => {
    if (!conversation.id) return Alert.alert("Invalid conversation");
    router.push({
      pathname: "/chats/[chatId]",
      params: { chatId: conversation.id.toString() },
    });
    onClose();
  };

  const handleConversationOptions = (conversation: Conversation) => {
    Alert.alert("Conversation Options", `Manage \"${conversation.title}\"`, [
      {
        text: "Rename",
        onPress: () => {
          setSelectedConversation(conversation);
          setNewTitle(conversation.title);
          setRenameModalVisible(true);
        },
      },
    
        {
          text: "Delete",
          onPress: () =>
            confirmDeleteConversation({ setConversations, conversation }),
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };




  const handleUpdatesAndFAQ = () => {
    console.log("Opening Updates & FAQ");
    onClose();

  };

  const handleRename = async () => {
    if (!selectedConversation || !newTitle.trim()) return;
    try {
      await renameConversationTitle(selectedConversation.id, newTitle.trim());
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversation.id
            ? { ...c, title: newTitle.trim() }
            : c
        )
      );
      setRenameModalVisible(false);
      setSelectedConversation(null);
      setNewTitle("");
    } catch (err) {
      console.error("Rename failed:", err);
      Alert.alert("Error", "Could not rename conversation.");
    }
  };

  const handleLogout = useHandleLogout();

  const renderConversationItem = (conversation: Conversation) => (
    <TouchableOpacity
      key={conversation.id}
      onPress={() => handleConversationPress(conversation)}
      className="flex-row items-center justify-between px-4 py-3"
    >
      <View className="flex-row items-center flex-1">
        <Icon name="message-circle" size={16} color={iconColor} />
        <Text
          style={{ color: textColor }}
          className="ml-3 text-base flex-1"
          numberOfLines={1}
        >
          {conversation.title}
        </Text>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity
          className="p-1 mr-2"
          onPress={() => handleConversationOptions(conversation)}
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
          backgroundColor,
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
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <TouchableOpacity
              onPress={handleNewConversation}
              style={{
                borderBottomColor: theme === "light" ? "#E5E7EB" : "#374151",
              }}
              className="flex-row items-center justify-between px-4 py-4 border-b"
            >
              <View className="flex-row items-center">
                <Icon name="message-square" size={20} color={iconColor} />
                <Text style={{ color: textColor }} className="ml-3 text-base">
                  New Conversation
                </Text>
              </View>
              <Icon name="chevron-right" size={16} color={iconColor} />
            </TouchableOpacity>

            <View className="py-2">
              <Text
                style={{ color: iconColor }}
                className="px-4 py-2 text-sm font-medium uppercase tracking-wide"
              >
                Conversations
              </Text>

              {loading ? (
                <View className="px-4 py-3">
                  <Text style={{ color: iconColor }} className="text-sm">
                    Loading conversations...
                  </Text>
                </View>
              ) : Array.isArray(conversations) && conversations.length > 0 ? (
                conversations.map(renderConversationItem)
              ) : (
                <View className="px-4 py-3">
                  <Text style={{ color: iconColor }} className="text-sm">
                    No conversations yet. Start a new conversation!
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
                onPress={() =>
                  handleClearConversations({ setConversations, onClose })
                }
                className="flex-row items-center px-4 py-3"
              >
                <Icon name="trash-2" size={18} color={iconColor} />
                <Text style={{ color: textColor }} className="ml-3 text-base">
                  Clear conversations
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
       
                onPress={ () => setFeedbackModalVisible(true)}
                className="flex-row items-center justify-between px-5 py-3"
              >
                <View className="flex-row items-center">
                  <Icon name="chatbox-ellipses" size={18} color={iconColor} />
                  <Text style={{ color: textColor }} className="ml-4 text-base">
                    አስተያየት ይስጡ
                  </Text>
                </View>
             
                 <Text className="text-yellow-400 text-base">⭐</Text>

                 
                
              </TouchableOpacity>
              {feedbackModalVisible && (
                <FeedbackModal
                  visible={feedbackModalVisible}
                  onClose={() => setFeedbackModalVisible(false)}
                  userEmail={""}
                />
              )}


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
                onPress={() => {
                  console.log("Opening Updates & FAQ");
                  onClose();
                }}
                className="flex-row items-center px-4 py-3"
              >
                <Icon name="help-circle" size={18} color={iconColor} />
                <Text style={{ color: textColor }} className="ml-3 text-base">
                  Updates & FAQ
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleLogout({ onClose })}
                className="flex-row items-center px-4 py-3"
              >
                <Icon name="log-out" size={18} color="#EF4444" />
                <Text className="ml-3 text-base text-red-500">Logout</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>

      {/* Rename Modal */}
      <Modal
        visible={renameModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-primary p-4 rounded-lg w-full max-w-md">
            <Text className="text-lg font-semibold mb-2">
              Rename Conversation
            </Text>
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Enter new title"
              className="border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <View className="flex-row justify-between">
              <TouchableOpacity onPress={() => setRenameModalVisible(false)}>
                <Text className="text-gray-500 text-base">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRename}>
                <Text className="text-blue-600 font-semibold text-base">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SideDrawer;
