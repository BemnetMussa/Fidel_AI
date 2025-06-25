import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { baseURL } from "@/lib/auth-client";
import ChatLayout from "./ChatLayout";
import ChatMessages, { Message } from "./ChatMessages";

export default function ChatView() {
  const { chatId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [conversationId, setConversationId] = useState<string>("");

  useEffect(() => {
    if (typeof chatId === "string") {
      setConversationId(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    loadingMessage();
  }, [conversationId]);

  const loadingMessage = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/api/message/${conversationId}`,
        {
          withCredentials: true,
        }
      );

      // console.log(response.data);

      // access the 'converstation' array from response
      const { messages } = response.data;
      console.log("fetching message from db", messages);

      if (!Array.isArray(messages)) {
        throw new Error("Expected an array of message from backend");
      }

      // formmating according to the setMessage state
      const { messages: rawMessages } = response.data;

      const formattedMessages = rawMessages.map((msg: any) => ({
        sender: msg.sender.toLowerCase(),
        text: msg.content,
        timestamp: msg.createdAt,
      }));

      setMessages(formattedMessages);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading conversations:", error);
      setLoading(false);
    }
  };

  const sendMessageToGemini = async (userMessage: string) => {
    try {
      setIsLoading(true);
      console.log("Sending message to Gemini:", userMessage);

      const response = await axios.post(
        conversationId && `${baseURL}/api/message/${conversationId}`,
        { content: userMessage },
        { withCredentials: true }
      );

      const {
        aiMessage,
        userMessage: savedUserMessage,
        conversationId: returnedId,
      } = response.data;

      // Store new conversationId
      if (!conversationId && returnedId) {
        console.log("New conversationId:", returnedId);
        setConversationId(returnedId.toString());
      }

      setMessages((prev) => [
        ...prev,
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
      ]);
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

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        text: "Hi! I'm your AI assistant powered by Gemini. How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  // fetch exsiting data
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;

      try {
        const response = await axios.get(`${baseURL}/api/message/${chatId}`, {
          withCredentials: true,
        });

        const { messages } = response.data;
        setMessages(messages);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    fetchMessages();
  }, [chatId]);

  return (
    <ChatLayout
      input={input}
      setInput={setInput}
      onSendMessage={sendMessage}
      isLoading={isLoading}
    >
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        scrollViewRef={scrollViewRef}
      />
    </ChatLayout>
  );
}