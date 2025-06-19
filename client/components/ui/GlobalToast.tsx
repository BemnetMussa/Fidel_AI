import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";

type ToastType = "success" | "error" | "info" | "warning";

const colors: Record<ToastType, string> = {
  success: "#4caf50",
  error: "#f44336",
  info: "#2196f3",
  warning: "#ff9800",
};

interface ToastData {
  message: string;
  type: ToastType;
  duration?: number;
}

export const GlobalToast = () => {
  const [visible, setVisible] = useState(false);
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const progress = useRef(new Animated.Value(1)).current;

  const showToast = (data: ToastData) => {
    setToastData(data);
    setVisible(true);

    Animated.timing(progress, {
      toValue: 0,
      duration: data.duration || 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      setVisible(false);
      progress.setValue(1); // Reset for next toast
    });
  };

  // Expose the function globally
  (global as any).showAppToast = showToast;

  if (!visible || !toastData) return null;

  const { message, type } = toastData;
  const backgroundColor = colors[type];
  const borderWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  return (
    <Animatable.View
      animation="bounceInDown"
      style={[styles.container, { backgroundColor }]}
    >
      <Text style={styles.message}>{message}</Text>
      <Animated.View
        style={[
          styles.progress,
          {
            width: borderWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
            backgroundColor: "#fff",
          },
        ]}
      />
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 6,
    zIndex: 999,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  message: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  progress: {
    height: 4,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});
