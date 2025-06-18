import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const NavBar = () => {
  return (
    <View className="flex-row border-b border-gray-300 items-center justify-between px-4 py-3 bg-white">
      <TouchableOpacity>
        <Icon name="menu" size={24} />
      </TouchableOpacity>
      <Text className="text-xl font-semibold">pAI</Text>
      <TouchableOpacity>
        <Image
          source={{ uri: "https://i.pravatar.cc/133" }}
          className="w-8 h-8 rounded-full"
        />
      </TouchableOpacity>
    </View>
  );
};

export default NavBar;
