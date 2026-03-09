import { COLORS, SHADOWS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface ActionButtonsProps {
  onJourneyPress: () => void;
  onPracticePress: () => void;
  onDictionaryPress: () => void;
}

export function ActionButtons({ onJourneyPress, onPracticePress, onDictionaryPress }: ActionButtonsProps) {
  return (
    <View style={{ gap: SPACING.sm, marginTop: SPACING.md }}>
      <Link href="/camera" asChild>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.accent.primary,
            borderRadius: 16,
            padding: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            ...SHADOWS.md,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="camera" size={24} color={COLORS.text.primary} />
          <Text
            style={{
              color: COLORS.text.primary,
              fontWeight: "600",
              fontSize: 18,
              marginLeft: 12,
            }}
          >
            Start Learning
          </Text>
        </TouchableOpacity>
      </Link>

      <View style={{ flexDirection: "row", gap: SPACING.sm }}>
        <TouchableOpacity
          onPress={onJourneyPress}
          style={{
            flex: 1,
            backgroundColor: COLORS.background.tertiary,
            borderRadius: 14,
            paddingVertical: 12,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: COLORS.border.secondary,
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name="map-outline"
            size={18}
            color={COLORS.accent.primary}
          />
          <Text
            style={{
              color: COLORS.text.secondary,
              fontWeight: "600",
              fontSize: 14,
              marginLeft: 8,
            }}
          >
            Journey
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDictionaryPress}
          style={{
            flex: 1,
            backgroundColor: COLORS.background.tertiary,
            borderRadius: 14,
            paddingVertical: 12,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: COLORS.border.secondary,
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name="book-outline"
            size={18}
            color={COLORS.accent.info}
          />
          <Text
            style={{
              color: COLORS.text.secondary,
              fontWeight: "600",
              fontSize: 14,
              marginLeft: 8,
            }}
          >
            Dictionary
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPracticePress}
          style={{
            flex: 1,
            backgroundColor: COLORS.background.tertiary,
            borderRadius: 14,
            paddingVertical: 12,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: COLORS.border.secondary,
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name="chatbubbles-outline"
            size={18}
            color={COLORS.accent.secondary}
          />
          <Text
            style={{
              color: COLORS.text.secondary,
              fontWeight: "600",
              fontSize: 14,
              marginLeft: 8,
            }}
          >
            Practice
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
