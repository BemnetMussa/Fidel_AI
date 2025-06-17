import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";

export default function ChatView() {
  const { chatId } = useLocalSearchParams();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
      console.log(input);
    }
  };

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
          className="flex-1 px-4 mb-16"
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {dummyMessages.map((msg, idx) => (
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
            />
            <TouchableOpacity
              onPress={sendMessage}
              className="p-2 active:opacity-80"
            >
              <MaterialCommunityIcons name="send" size={24} />
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
