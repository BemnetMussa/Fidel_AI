import {
  Modal,
  TextInput,
  Alert,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { useState } from "react";
import { baseURL } from "@/lib/auth-client";

type FeedbackModalProps = {
  visible: boolean;
  onClose: () => void;
  userEmail: string;
};

export default function FeedbackModal({
  visible,
  onClose,
  userEmail,
}: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("");

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert("Error", "Please write something.");
      return;
    }

    try {
      const response = await fetch(`https://${baseURL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback, email: userEmail }),
      });

      if (response.ok) {
        Alert.alert("Thank you!", "Your feedback was submitted.");
        setFeedback("");
        onClose();
      } else {
        Alert.alert("Error", "Failed to send feedback.");
      }
    } catch (error) {
      console.log("submit feedback", error);
      (global as any).showAppToast({
        message: "Something went wrong. Try again.!",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-center items-center px-6"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      >
        <View className="bg-white rounded-lg p-6 w-full">
          <Text className="text-lg font-semibold mb-3">እባክዎ አስተያየትዎን ያካትቱ</Text>
          <TextInput
            placeholder="እውነተኛ አስተያየት ያቀርቡ..."
            multiline
            numberOfLines={8}
            className="border border-gray-300 rounded-md px-3 py-3 text-gray-800 text-lg min-h-[120px] mb-2"
            value={feedback}
            onChangeText={setFeedback}
            textAlignVertical="top"
          />
          <View className="flex-row justify-end mt-4 space-x-4">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-gray-500 font-semibold text-base pr-4">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmitFeedback}>
              <Text className="text-blue-600 font-semibold text-base">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
