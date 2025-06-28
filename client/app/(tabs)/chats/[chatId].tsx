import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { baseURL } from "@/lib/auth-client";
import ChatLayout from "./ChatLayout";
import ChatMessages, { Message } from "./ChatMessages";
import { getCachedMessages, saveMessages } from "@/lib/storage";
import { getCachedConversation, saveConversation } from "@/lib/storage";

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
      // Clear messages immediately when chatId changes for smooth transition
      setMessages([]);

      const cached = await getCachedMessages();
      if (cached.length) {
        setMessages(cached);
      }

      if (typeof chatId === "string") {
        setConversationId(chatId);
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

      // Only set messages if there are actual messages from the backend
      // Otherwise, show the initial greeting for new conversations
      if (formattedMessages.length > 0) {
        setMessages(formattedMessages);
        await saveMessages(formattedMessages);
      } else {
        const initialMessage: Message[] = [
          {
            sender: "ai",
            text: "Hi! I'm your AI assistant powered by Gemini. How can I help you today?",
            timestamp: new Date().toISOString(),
          },
        ];
        setMessages(initialMessage);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      Alert.alert("Error", "Failed to load messages.");

      const initialMessage: Message[] = [
        {
          sender: "ai",
          text: "Hi! I'm your AI assistant powered by Gemini. How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ];
      setMessages(initialMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to update cached conversations
  const updateCachedConversations = async (newConversation: any) => {
    try {
      const cachedConversations = await getCachedConversation();
      const conversationExists = cachedConversations.some(
        (conv) => conv.id === newConversation.id
      );

      if (!conversationExists) {
        const updatedConversations = [newConversation, ...cachedConversations];
        await saveConversation(updatedConversations);
      }
    } catch (error) {
      console.error("Error updating cached conversations:", error);
    }
  };

  const sendMessageToGemini = async (userMessage: string) => {
    try {
      setIsLoading(true);
      console.log("Sending message to Gemini:", userMessage);

      // Determine the API endpoint based on whether we have a conversationId
      const apiUrl = conversationId
        ? `${baseURL}/api/message/${conversationId}`
        : `${baseURL}/api/message`; // For new conversations without ID

      const response = await axios.post(
        apiUrl,
        { content: userMessage },
        { withCredentials: true }
      );

      const {
        aiMessage,
        userMessage: savedUserMessage,
        conversationId: returnedId,
        conversation, // The backend should return the conversation object
      } = response.data;

      // If this is a new conversation, update the conversationId and cache
      if (!conversationId && returnedId) {
        console.log("New conversationId:", returnedId);
        setConversationId(returnedId.toString());

        // Update cached conversations with the new conversation
        if (conversation) {
          await updateCachedConversations(conversation);
        }
      }

      const newMessages: Message[] = [
        ...messages,
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

      setMessages(newMessages);
      await saveMessages(newMessages);
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

  // Clear messages when component unmounts or chatId changes
  useEffect(() => {
    return () => {
      setMessages([]);
    };
  }, []);

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
 