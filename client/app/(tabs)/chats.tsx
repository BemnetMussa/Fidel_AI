import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useRef } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import axios, { isAxiosError } from "axios";

// Add your Gemini API key here
const GEMINI_API_KEY = "YOUR_API_KEY";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function ChatView() {
  const { chatId } = useLocalSearchParams();

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
          contents: [
            {
              parts: [
                {
                  text: userMessage,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
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

      // Add error message
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

      // Add user message immediately
      const newUserMessage: Message = {
        sender: "user",
        text: userMessage,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setInput("");

      // Send to Gemini API
      await sendMessageToGemini(userMessage);
    }
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // This is for the Input to come up with the keyboard
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

  // Initialize with a welcome message
  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        text: "Hi! I'm your AI assistant powered by Gemini. How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row border-b border-gray-300 items-center justify-between px-4 py-3 bg-white">
        <TouchableOpacity>
          <Icon name="menu" size={24} />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">pAI</Text>
        <TouchableOpacity>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?u=" + chatId }}
            className="w-8 h-8 rounded-full"
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 mb-16"
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
                    ? "bg-blue-500 rounded-l-2xl rounded-tr-2xl rounded-br-md"
                    : "bg-gray-200 rounded-r-2xl rounded-tl-2xl rounded-bl-md"
                }`}
                style={[
                  msg.sender === "user" ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text
                  className={`${
                    msg.sender === "user" ? "text-white" : "text-black"
                  }`}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <View className="flex-row justify-start my-1">
              <View className="bg-gray-200 rounded-r-2xl rounded-tl-2xl rounded-bl-md px-4 py-3">
                <ActivityIndicator size="small" color="#666" />
              </View>
            </View>
          )}
        </ScrollView>

        <View
          className="border-t border-gray-300 px-4 bg-white"
          style={[
            styles.inputContainer,
            Platform.OS === "android" &&
              keyboardHeight > 0 && {
                bottom: keyboardHeight,
              },
          ]}
        >
          <View className="flex-row items-center space-x-3">
            <TextInput
              className="flex-1 px-3 py-2 rounded-md border border-gray-300 bg-gray-50"
              placeholder="Ask anything..."
              placeholderTextColor="#aaa"
              value={input}
              onChangeText={setInput}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={sendMessage}
              className={`p-2 ${isLoading ? "opacity-50" : "active:opacity-80"}`}
              disabled={isLoading}
            >
              <MaterialCommunityIcons
                name="send"
                size={24}
                color={isLoading ? "#ccc" : "#007AFF"}
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

// This is Dummy data and will be replace with fetched user conversation
const dummyMessages = [
  { sender: "user", text: "Hello!" },
  { sender: "ai", text: "Hi! How can I help you today?" },
  { sender: "user", text: "Tell me a joke." },
  {
    sender: "ai",
    text: "Why don't scientists trust atoms? Because they make up everything!",
  },
  { sender: "user", text: "What's the weather like today?" },
  {
    sender: "ai",
    text: "I can't fetch real-time weather, but it's always sunny in here ☀️",
  },
  { sender: "user", text: "How do you define AI?" },
  {
    sender: "ai",
    text: "AI, or Artificial Intelligence, refers to systems that mimic human intelligence.",
  },
  { sender: "user", text: "What's 24 multiplied by 17?" },
  { sender: "ai", text: "24 × 17 is 408." },
  { sender: "user", text: "Can you write me a haiku?" },
  {
    sender: "ai",
    text: "Soft breeze through the trees,\nwhispers secrets to the leaves,\nnature's calm embrace.",
  },
  { sender: "user", text: "Who wrote 1984?" },
  { sender: "ai", text: "1984 was written by George Orwell." },
  { sender: "user", text: "Tell me a fun fact." },
  { sender: "ai", text: "Octopuses have three hearts and blue blood!" },
  { sender: "user", text: "Can you help me learn Spanish?" },
  {
    sender: "ai",
    text: "Of course! Let's start with basics like 'Hola' for 'Hello'.",
  },
  { sender: "user", text: "What’s the capital of Japan?" },
  { sender: "ai", text: "The capital of Japan is Tokyo." },
  { sender: "user", text: "Recommend me a movie." },
  {
    sender: "ai",
    text: "You might enjoy 'Inception' if you like sci-fi and mind-bending plots.",
  },
  { sender: "user", text: "What's the speed of light?" },
  {
    sender: "ai",
    text: "The speed of light is approximately 299,792 kilometers per second.",
  },
  { sender: "user", text: "Can you summarize the news?" },
  {
    sender: "ai",
    text: "I can't pull live news, but I can explain recent trends or history if you'd like!",
  },
];
