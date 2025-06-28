import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { baseURL } from "@/lib/auth-client";
import ChatLayout from "./ChatLayout";
import ChatMessages, { Message } from "./ChatMessages";
import { getCachedMessages, saveMessages } from "@/lib/storage";

export default function ChatView() {
  const { chatId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [conversationId, setConversationId] = useState<string>("");

  // Load cached messages on mount or when chatId changes
  useEffect(() => {
    const loadCachedAndFetchMessage = async () => {
      if (typeof chatId === "string") {
        setConversationId(chatId);
        const cached = await getCachedMessages(chatId);
        if (cached.length) {
          setMessages(cached);
        } else {
          // Optionally, initial AI greeting if no cached messages
          setMessages([
            {
              sender: "ai",
              text: "Hi! I'm your AI assistant powered by Gemini. How can I help you today?",
              timestamp: new Date().toISOString(),
            },
          ]);
        }
        await loadingMessage(chatId);
      }
    };

    loadCachedAndFetchMessage();
  }, [chatId]);

  // Fetch fresh messages from backend
  const loadingMessage = async (convId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/message/${convId}`, {
        withCredentials: true,
      });

      const { messages: rawMessages } = response.data;

      if (!Array.isArray(rawMessages)) {
        throw new Error("Expected an array of messages from backend");
      }

      const formattedMessages = rawMessages.map((msg: any) => ({
        sender: (msg.sender.toLowerCase() === "user" ? "user" : "ai") as
          | "user"
          | "ai",
        text: msg.content,
        timestamp: msg.createdAt,
      }));

      setMessages(formattedMessages);
      await saveMessages(convId, formattedMessages);
    } catch (error) {
      console.error("Error loading conversations:", error);
      console.log(error);
      Alert.alert("Error", "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessageToGemini = async (userMessage: string) => {
    try {
      setIsLoading(true);
      console.log("Sending message to Gemini:", userMessage);

      console.log("this is conversation is", conversationId);

      const response = await axios.post(
        conversationId
          ? `${baseURL}/api/message/${conversationId}`
          : `${baseURL}/api/message`,
        { content: userMessage },
        { withCredentials: true }
      );

      const {
        message: { aiMessage, userMessage: savedUserMessage },
        conversationId: returnedId,
      } = response.data;

      const usedConversationId = conversationId || returnedId;
      if (!conversationId && returnedId) {
        setConversationId(returnedId.toString());
      }

      const newMessages: Message[] = [
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
      ];

      console.log("new message retirive", newMessages);

      setMessages((prev) => [...prev, ...newMessages]);
      await saveMessages(usedConversationId, newMessages);
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
      setInput("");
      await sendMessageToGemini(userMessage);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <ChatLayout
      input={input}
      setInput={setInput}
      onSendMessage={sendMessage}
      isLoading={isLoading || loading}
    >
      <ChatMessages
        messages={messages}
        isLoading={isLoading || loading}
        scrollViewRef={scrollViewRef}
      />
    </ChatLayout>
  );
}
