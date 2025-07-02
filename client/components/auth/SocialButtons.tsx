import type React from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/Button";
// import { authClient } from "@/lib/auth-client";
// import Toast from "react-native-toast-message";

// google auth
const signWithGoogle = async () => {
  console.log("this is from google");
  // const { data, error } = await authClient.signIn.social({
  //   provider: "google",
  // });

  // if (error) {
  //   console.log("error while auth in google", error);
  //   Toast.show({
  //     type: "error",
  //     text1: "Can't Authenticate with Google",
  //     visibilityTime: 3000,
  //   });
  //   return;
  // }

  // console.log("this is from google", data);
};

export const signWithFacebook = async () => {
  console.log("this is from facbook");
};

export const SocialButtons: React.FC = () => {
  return (
    <View className="flex-row gap-3">
      <View className="flex-1">
        <Button title="GOOGLE" onPress={signWithGoogle} variant="google" />
      </View>
      <View className="flex-1">
        <Button
          title="FACEBOOK"
          onPress={signWithFacebook}
          variant="facebook"
        />
      </View>
    </View>
  );
};
