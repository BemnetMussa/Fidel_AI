import React, { useEffect } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import { authClient } from "@/lib/auth-client";

// Required for Expo Auth Session to handle redirects
WebBrowser.maybeCompleteAuthSession(); //to dismiss the web popup

export const SocialButtons: React.FC = () => {
  // Google OAuth setup
  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useIdTokenAuthRequest({
      clientId: "your-google-client-id", // Same as backend
      iosClientId: "your-google-ios-client-id", // Optional
      androidClientId: "your-google-android-client-id", // Optional
      redirectUri: "http://localhost:8081",
    });

  // Facebook OAuth setup
  const [facebookRequest, facebookResponse, facebookPromptAsync] =
    Facebook.useAuthRequest({
      clientId: "your-facebook-app-id", // Same as backend
      redirectUri: "yourapp:/oauthredirect",
    });

  // Handle Google response
  useEffect(() => {
    const handleGoogle = async () => {
      if (googleResponse?.type === "success") {
        const { id_token } = googleResponse.params;

        // we are taking the token id from google service provider and passing it to better in the server
        authClient.signIn.social(
          {
            provider: "google",
            idToken: {
              token: id_token,
            },
          },
          {
            onSuccess: ({ data }) => {
              console.log("Google sign-in successful:", data);
              // Handle navigation or state update
            },
            onError: ({ error }) => {
              console.error("Google sign-in failed:", error);
            },
          }
        );
      }
    };

    handleGoogle();
  }, [googleResponse]);

  // Handle Facebook response
  useEffect(() => {
    const handleFacebook = async () => {
      if (facebookResponse?.type === "success") {
        const { code } = facebookResponse.params;

        // we are taking the token id from facebook service provider and passing it to better in the server
        await authClient.signIn.social(
          {
            provider: "facebook",
            idToken: {
              token: code, // Facebook uses auth code, not ID token
            },
          },
          {
            onSuccess: ({ data }) => {
              console.log("Facebook sign-in successful:", data);
              // Handle navigation or state update
            },
            onError: ({ error }) => {
              console.error("Facebook sign-in failed:", error);
            },
          }
        );
      }
    };

    handleFacebook();
  }, [facebookResponse]);

  return (
    <View className="flex-row gap-3">
      <View className="flex-1">
        <Button
          title="GOOGLE"
          variant="google"
          disabled={!googleRequest}
          onPress={() => {
            googlePromptAsync();
          }}
        />
      </View>
      <View className="flex-1">
        <Button
          title="FACEBOOK"
          variant="facebook"
          disabled={!facebookRequest}
          onPress={() => {
            facebookPromptAsync();
          }}
        />
      </View>
    </View>
  );
};
