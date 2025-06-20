import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import SideDrawer from "./SideDrawer"; // Import the SideDrawer component

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
  const [sideDrawerVisible, setSideDrawerVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const { theme, toggleTheme } = useTheme();

  const backgroundColor = Colors[theme].background;
  const textColor = Colors[theme].text;
  const iconColor = Colors[theme].icon;

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

  const openSideDrawer = () => {
    setSideDrawerVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const closeSideDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSideDrawerVisible(false));
  };

  const handleLogoPress = () => {
    //TODO: Implement the route to home
    console.log("Navigating to home");
  };

  const handleDropdownItemPress = (action: AppRoutes) => {
    setDropdownVisible(false);
    if (action === "theme") {
      toggleTheme();
    }
    setTimeout(() => {
      // TODO: Implement the route here
      //   router.push(`/?${action}`);
    }, 200);
  };

  return (
    <>
      <View
        style={{
          backgroundColor: backgroundColor,
          borderBottomColor: theme === "light" ? "#D1D5DB" : "#374151",
        }}
        className="flex-row border-b items-center justify-between px-4 py-3"
      >
        <TouchableOpacity onPress={openSideDrawer}>
          <Icon name="menu" size={24} color={iconColor} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleLogoPress()}>
          <Text style={{ color: textColor }} className="text-xl font-semibold">
            pAI
          </Text>
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
                backgroundColor: backgroundColor,
                borderColor: theme === "light" ? "#E5E7EB" : "#374151",
              }}
              className="absolute top-10 right-0 rounded-lg shadow-lg border min-w-48 z-50"
            >
              <View
                style={{
                  borderBottomColor: theme === "light" ? "#F3F4F6" : "#374151",
                }}
                className="px-4 py-3 border-b"
              >
                <Text style={{ color: textColor }} className="font-semibold">
                  John Doe
                </Text>
                <Text style={{ color: iconColor }} className="text-sm">
                  john.doe@email.com
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleDropdownItemPress("theme")}
                className="flex-row items-center px-4 py-3"
              >
                <Icon
                  name={theme === "light" ? "moon" : "sun"}
                  size={16}
                  color={iconColor}
                />
                <Text style={{ color: textColor }} className="ml-3">
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDropdownItemPress("settings")}
                className="flex-row items-center px-4 py-3"
              >
                <Icon name="settings" size={16} color={iconColor} />
                <Text style={{ color: textColor }} className="ml-3">
                  Settings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDropdownItemPress("help")}
                className="flex-row items-center px-4 py-3"
              >
                <Icon name="help-circle" size={16} color={iconColor} />
                <Text style={{ color: textColor }} className="ml-3">
                  Help
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDropdownItemPress("logout")}
                style={{
                  borderTopColor: theme === "light" ? "#F3F4F6" : "#374151",
                }}
                className="flex-row items-center px-4 py-3 border-t"
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

      <SideDrawer
        isVisible={sideDrawerVisible}
        onClose={closeSideDrawer}
        slideAnim={slideAnim}
      />
    </>
  );
};

export default NavBar;
