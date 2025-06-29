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
  const [isFetching, setIsFetching] = useState(false); // scroll up loading
  const [isSending, setIsSending] = useState(false); // AI typing spinner

  // Load cached messages on mount or when chatId changes
  useEffect(() => {
    const loadCachedAndFetchMessage = async () => {
      if (typeof chatId === "string") {
        setConversationId(chatId);
        const cached = await getCachedMessages(chatId);
        console.log("Cached data: ", cached.length);
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
          await loadingMessage(chatId);
        }
      }
    };

    loadCachedAndFetchMessage();
  }, [chatId]);

  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  const loadMoreMessages = async () => {
    if (!conversationId || !hasMore || isFetching) return;

    setIsFetching(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/message/${conversationId}?cursor=${cursor}&limit=15`,
        { withCredentials: true }
      );

      const { messages: rawMessages, nextCursor } = res.data;

      const newMessages: Message[] = rawMessages.map((msg: any) => ({
        sender: msg.sender.toLowerCase() === "user" ? "user" : "ai",
        text: msg.content,
        timestamp: msg.createdAt,
      }));

      setMessages((prev) => [...newMessages, ...prev]); // prepend
      setCursor(nextCursor);
      setHasMore(Boolean(nextCursor));

      await saveMessages(conversationId, [...newMessages, ...messages]);
    } catch (err) {
      console.error("Failed to load more:", err);
    } finally {
      setIsFetching(false);
    }
  };

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
      setIsSending(true);

      const response = await axios.post(
        conversationId
          ? `${baseURL}/api/message/${conversationId}`
          : `${baseURL}/api/message`,
        { content: userMessage },
        { withCredentials: true }
      );

      const {
        message: { aiMessage },
        conversationId: returnedId,
      } = response.data;

      const usedConversationId = conversationId || returnedId;
      if (!conversationId && returnedId) {
        setConversationId(returnedId.toString());
      }

      const newAiMessage: Message = {
        sender: "ai",
        text: aiMessage.content,
        timestamp: aiMessage.createdAt,
      };

      setMessages((prev) => [...prev, newAiMessage]);
      await saveMessages(usedConversationId, [newAiMessage]); // save only the AI one
    } catch (error) {
      console.error("Error calling backend:", error);
      Alert.alert("Error", "Failed to send message. Try again.");
    } finally {
      setIsSending(false);
    }
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = input.trim();
      setInput("");

      const newUserMessage: Message = {
        sender: "user",
        text: userMessage,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
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
        isSending={isSending}
        isFetching={isFetching}
        scrollViewRef={scrollViewRef}
        onScrollTop={loadMoreMessages}
      />
    </ChatLayout>
  );
}
