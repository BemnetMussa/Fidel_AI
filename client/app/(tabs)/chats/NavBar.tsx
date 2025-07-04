import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useState, useEffect } from "react";
import {
  Animated,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import SideDrawer from "./SideDrawer";
import { useRouter, usePathname } from "expo-router";
import { authClient } from "@/lib/auth-client";

type AppRoutes =
  | ""
  | "profile"
  | "messages"
  | "notifications"
  | "saved"
  | "settings"
  | "help"
  | "logout"
  | "theme"
  | "refresh";

const NavBar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownAnim] = useState(new Animated.Value(0));
  const [sideDrawerVisible, setSideDrawerVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const { theme, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const backgroundColor = Colors[theme].background;
  const textColor = Colors[theme].text;
  const iconColor = Colors[theme].icon;

  const fetchUser = async () => {
    try {
      const session = await authClient.getSession();
      console.log("Session:", session);
      if (session?.data?.session?.userId && session.data.user) {
        console.log("Using session user data");
        setUser({
          name: session.data.user.name || "Unknown User",
          email: session.data.user.email || "No email",
        });
      } else {
        console.log("No valid user ID in session");
        setUser({ name: "Guest", email: "" });
      }
    } catch (error) {
      console.error("Failed to get session:", error);
      setUser({ name: "Guest", email: "" });
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

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
    router.replace("/(tabs)/chats");
  };

  const handleRefresh = () => {
    console.log("Refreshing:", pathname);
    fetchUser();
  };

  const handleDropdownItemPress = (action: AppRoutes) => {
    setDropdownVisible(false);
    if (action === "theme") {
      toggleTheme();
    } else if (action === "refresh") {
      handleRefresh();
    } else if (action === "logout") {
      if ("signOut" in authClient) {
        (authClient as any)
          .signOut()
          .then(() => {
            router.replace("/login");
          })
          .catch((error: unknown) => console.error("Logout failed:", error));
      } else {
        setUser(null);
        router.replace("/login");
        console.log("Logout triggered manually, session cleared locally");
      }
    }
  };

  const renderDropdown = () => (
    <>
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={() => setDropdownVisible(false)}
      />
      <Animated.View
        style={[
          styles.dropdown,
          {
            backgroundColor,
            borderColor: theme === "light" ? "#E5E7EB" : "#374151",
            top: insets.top + 60,
            opacity: dropdownAnim,
            transform: [
              {
                scale: dropdownAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        <View
          style={{
            borderBottomColor: theme === "light" ? "#F3F4F6" : "#374151",
          }}
          className="px-4 py-3 border-b"
        >
          <Text style={{ color: textColor }} className="font-semibold">
            {user?.name || "Loading..."}
          </Text>
          <Text style={{ color: iconColor }} className="text-sm">
            {user?.email || ""}
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
          onPress={() => handleDropdownItemPress("refresh")}
          className="flex-row items-center px-4 py-3"
        >
          <Icon name="refresh-ccw" size={16} color={iconColor} />
          <Text style={{ color: textColor }} className="ml-3">
            Refresh
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
    </>
  );

  return (
    <>
      <SafeAreaView style={{ backgroundColor }} edges={["top"]}>
        <View
          style={{
            backgroundColor,
            borderBottomColor: theme === "light" ? "#D1D5DB" : "#374151",
          }}
          className="flex-row border-b items-center justify-between px-4 py-3"
        >
          <TouchableOpacity onPress={openSideDrawer}>
            <Icon name="menu" size={24} color={iconColor} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogoPress}>
            <Text
              style={{ color: textColor }}
              className="text-xl font-semibold"
            >
              ፊደል <Text className="text-secondary">AI</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleDropdown}>
            <Image
              source={{ uri: "https://i.pravatar.cc/133" }}
              className="w-8 h-8 rounded-full"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {dropdownVisible && renderDropdown()}

      <SideDrawer
        isVisible={sideDrawerVisible}
        onClose={closeSideDrawer}
        slideAnim={slideAnim}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    right: 16,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 192,
    zIndex: 9999,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
});

export default NavBar;
