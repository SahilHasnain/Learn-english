import { EnglishLevel, LearningLanguage } from "@/services/storageService";
import { COLORS, SHADOWS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface HomeHeaderProps {
  currentLevel: EnglishLevel | null;
  currentLanguage: LearningLanguage | null;
  onSettingsPress: () => void;
}

export function HomeHeader({ currentLevel, currentLanguage, onSettingsPress }: HomeHeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 24,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.md,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.accent.primary,
          ...SHADOWS.md,
        }}
      >
        <Ionicons name="book" size={24} color={COLORS.text.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: COLORS.text.primary,
          }}
        >
          ScanLearn
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: COLORS.text.tertiary,
          }}
        >
          Learn from the world around you
        </Text>
      </View>
      {currentLevel && (
        <TouchableOpacity
          onPress={onSettingsPress}
          style={{
            backgroundColor: COLORS.background.tertiary,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: COLORS.border.secondary,
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "600",
              color: COLORS.accent.primary,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {currentLanguage
              ? `${currentLanguage} · ${currentLevel}`
              : currentLevel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
