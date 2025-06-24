import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const data = [
  {
    id: "1",
    title: "Design a database schema",
    subtitle: "for an online merch store",
  },
  { id: "2", title: "Explain airplane", subtitle: "to someone 5 years old" },
  { id: "3", title: "Write a poem", subtitle: "about space travel" },
  { id: "4", title: "Suggest app names", subtitle: "for a chat assistant" },
  { id: "5", title: "Summarize news", subtitle: "about climate change" },
];

const CardSlider = () => {
  const { theme } = useTheme();

  return (
    <View className="absolute bottom-5 w-full">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`${theme === "dark" ? "bg-[#2e2e2e]" : "bg-[#efefef]"} p-4 rounded-xl mr-3 w-[220px] h-[80px] justify-center shadow-sm shadow-black/10`}
          >
            <Text
              className={`text-xl font-extrabold ${theme === "dark" ? "text-white" : "text-black"} mb-1`}
            >
              {item.title}
            </Text>
            <Text
              className={`text-s ${theme === "dark" ? "text-white" : "text-black"}`}
            >
              {item.subtitle}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CardSlider;
