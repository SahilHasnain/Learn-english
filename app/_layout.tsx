import { useAppStore } from "@/services/store";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

export default function RootLayout() {
  const fetchApiKey = useAppStore((s) => s.fetchApiKey);

  useEffect(() => {
    fetchApiKey();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="camera"
          options={{
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen name="results" />
        <Stack.Screen
          name="journey"
          options={{
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="practice"
          options={{
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
