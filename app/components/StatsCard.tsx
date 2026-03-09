import { COLORS, SHADOWS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface StatsCardProps {
  wordsToday: number;
  totalWords: number;
  streak: number;
  onPress: () => void;
}

export function StatsCard({ wordsToday, totalWords, streak, onPress }: StatsCardProps) {
  if (totalWords === 0) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        backgroundColor: COLORS.background.tertiary,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border.secondary,
        gap: SPACING.md,
        marginBottom: SPACING.md,
        ...SHADOWS.md,
      }}
      activeOpacity={0.7}
    >
      <View style={{ alignItems: "center", gap: 4, flex: 1 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: `${COLORS.accent.secondary}33`,
          }}
        >
          <Ionicons
            name="book-outline"
            size={18}
            color={COLORS.accent.secondary}
          />
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: COLORS.text.primary,
          }}
        >
          {totalWords}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: COLORS.text.tertiary,
          }}
        >
          words
        </Text>
      </View>

      {streak > 0 && (
        <>
          <View
            style={{ width: 1, backgroundColor: COLORS.border.primary }}
          />
          <View style={{ alignItems: "center", gap: 4, flex: 1 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: `${COLORS.accent.warning}33`,
              }}
            >
              <Ionicons
                name="flame"
                size={18}
                color={COLORS.accent.warning}
              />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: COLORS.text.primary,
              }}
            >
              {streak}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.text.tertiary,
              }}
            >
              day streak
            </Text>
          </View>
        </>
      )}

      {wordsToday > 0 && (
        <>
          <View
            style={{ width: 1, backgroundColor: COLORS.border.primary }}
          />
          <View style={{ alignItems: "center", gap: 4, flex: 1 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: `${COLORS.accent.success}33`,
              }}
            >
              <Ionicons
                name="calendar"
                size={18}
                color={COLORS.accent.success}
              />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: COLORS.text.primary,
              }}
            >
              {wordsToday}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.text.tertiary,
              }}
            >
              today
            </Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}
