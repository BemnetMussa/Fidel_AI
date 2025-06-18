import { router } from "expo-router";
import React, { useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

type AppRoutes =
  | ""
  | "profile"
  | "messages"
  | "notifications"
  | "saved"
  | "settings"
  | "help"
  | "logout"
  | "theme";

const NavBar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownAnim] = useState(new Animated.Value(0));

  // Avatar Dropdown
  const toggleDropdown = () => {
    if (dropdownVisible) {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setDropdownVisible(false));
    } else {
      setDropdownVisible(true);
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLogoPress = () => {
    //TODO: Implement the route to home
    console.log("Navigating to home");
  };

  const handleDropdownItemPress = (action: AppRoutes) => {
    setDropdownVisible(false);
    if (action === "theme") {
      // TODO: Implement the route to page including the theme
    }
    setTimeout(() => {
      // TODO: Implement the route to page including the theme
      //   router.push(`/?${action}`);
    }, 200);
  };

  return (
    <>
      <View className="flex-row border-b border-gray-300 items-center justify-between px-4 py-3 bg-white">
        <TouchableOpacity>
          <Icon
            name="menu"
            size={24}
            color="#374151"
            onPress={() => console.log("Hamburger is clicked")}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleLogoPress()}>
          <Text className="text-xl font-semibold text-gray-800">pAI</Text>
        </TouchableOpacity>

        <View className="relative">
          <TouchableOpacity onPress={toggleDropdown}>
            <Image
              source={{ uri: "https://i.pravatar.cc/133" }}
              className="w-8 h-8 rounded-full"
            />
          </TouchableOpacity>

          {dropdownVisible && (
            <Animated.View
              style={{
                opacity: dropdownAnim,
                transform: [
                  {
                    scale: dropdownAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              }}
              className="absolute top-10 right-0 bg-white rounded-lg shadow-lg border border-gray-200 min-w-48 z-50"
            >
              <View className="px-4 py-3 border-b border-gray-100">
                <Text className="font-semibold text-gray-800">John Doe</Text>
                <Text className="text-sm text-gray-500">
                  john.doe@email.com
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDropdownItemPress("settings")}
                className="flex-row items-center px-4 py-3"
              >
                <Icon name="settings" size={16} color="#6B7280" />
                <Text className="ml-3 text-gray-700">Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDropdownItemPress("help")}
                className="flex-row items-center px-4 py-3"
              >
                <Icon name="help-circle" size={16} color="#6B7280" />
                <Text className="ml-3 text-gray-700">Help</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDropdownItemPress("logout")}
                className="flex-row items-center px-4 py-3 border-t border-gray-100"
              >
                <Icon name="log-out" size={16} color="#EF4444" />
                <Text className="ml-3 text-red-500">Logout</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>

      {dropdownVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
          className="absolute inset-0 z-40"
        />
      )}
    </>
  );
};

export default NavBar;
