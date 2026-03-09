import EnglishPracticeChat from "@/app/components/EnglishPracticeChat";
import { COLORS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PracticeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.background.primary }}
      edges={["top", "bottom"]}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.md,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border.subtle,
          backgroundColor: COLORS.background.secondary,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            backgroundColor: COLORS.background.tertiary,
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: `${COLORS.accent.secondary}33`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="chatbubbles"
            size={18}
            color={COLORS.accent.secondary}
          />
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: COLORS.text.primary,
          }}
        >
          Practice English
        </Text>
      </View>

      {/* Full-screen chat component */}
      <EnglishPracticeChat />
    </SafeAreaView>
  );
}
