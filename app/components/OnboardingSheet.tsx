import { EnglishLevel, LearningLanguage } from "@/services/storageService";
import { COLORS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetMethods,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const LANGUAGE_OPTIONS: {
  language: LearningLanguage;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    language: "hindi",
    label: "Hindi",
    description: "Learn English through Hindi meanings",
    icon: "language",
  },
  {
    language: "urdu",
    label: "Urdu",
    description: "Learn English through Urdu meanings",
    icon: "language",
  },
  {
    language: "english",
    label: "English Only",
    description: "Learn with English definitions only",
    icon: "globe",
  },
];

const LEVEL_OPTIONS: {
  level: EnglishLevel;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    level: "beginner",
    label: "Beginner",
    description: "I'm just starting to learn English",
    icon: "leaf",
  },
  {
    level: "intermediate",
    label: "Intermediate",
    description: "I can have basic conversations",
    icon: "trending-up",
  },
  {
    level: "advanced",
    label: "Advanced",
    description: "I want to polish my English",
    icon: "rocket",
  },
];

interface OnboardingSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetMethods>;
  onboardingStep: "language" | "level";
  currentLevel: EnglishLevel | null;
  currentLanguage: LearningLanguage | null;
  snapPoints: string[];
  onLanguageSelect: (language: LearningLanguage) => void;
  onLevelSelect: (level: EnglishLevel) => void;
  onSheetChange: () => void;
}

export function OnboardingSheet({
  bottomSheetRef,
  onboardingStep,
  currentLevel,
  currentLanguage,
  snapPoints,
  onLanguageSelect,
  onLevelSelect,
  onSheetChange,
}: OnboardingSheetProps) {
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={currentLevel && currentLanguage ? "close" : "none"}
      />
    ),
    [currentLevel, currentLanguage],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={onSheetChange}
      enablePanDownToClose={!!(currentLevel && currentLanguage)}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: COLORS.background.secondary,
      }}
      handleIndicatorStyle={{
        backgroundColor: COLORS.text.tertiary,
        width: 40,
      }}
    >
      <BottomSheetView style={{ flex: 1, padding: 24, paddingBottom: 40 }}>
        {onboardingStep === "language" ? (
          <>
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: `${COLORS.accent.primary}33`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name="language"
                  size={28}
                  color={COLORS.accent.primary}
                />
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: COLORS.text.primary,
                  textAlign: "center",
                }}
              >
                Your Language
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.text.tertiary,
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                Learn English through which language?
              </Text>
            </View>

            <View style={{ gap: 10 }}>
              {LANGUAGE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.language}
                  onPress={() => onLanguageSelect(option.language)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                    padding: 16,
                    borderRadius: 16,
                    backgroundColor:
                      currentLanguage === option.language
                        ? `${COLORS.accent.primary}20`
                        : COLORS.background.tertiary,
                    borderWidth: 2,
                    borderColor:
                      currentLanguage === option.language
                        ? COLORS.accent.primary
                        : COLORS.border.secondary,
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor:
                        currentLanguage === option.language
                          ? `${COLORS.accent.primary}33`
                          : `${COLORS.text.tertiary}20`,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={20}
                      color={
                        currentLanguage === option.language
                          ? COLORS.accent.primary
                          : COLORS.text.tertiary
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: COLORS.text.primary,
                      }}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: COLORS.text.tertiary,
                        marginTop: 2,
                      }}
                    >
                      {option.description}
                    </Text>
                  </View>
                  {currentLanguage === option.language && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.accent.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: `${COLORS.accent.primary}33`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name="school"
                  size={28}
                  color={COLORS.accent.primary}
                />
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: COLORS.text.primary,
                  textAlign: "center",
                }}
              >
                Your English Level
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.text.tertiary,
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                We&apos;ll adjust words and sentences for you
              </Text>
            </View>

            <View style={{ gap: 10 }}>
              {LEVEL_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.level}
                  onPress={() => onLevelSelect(option.level)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                    padding: 16,
                    borderRadius: 16,
                    backgroundColor:
                      currentLevel === option.level
                        ? `${COLORS.accent.primary}20`
                        : COLORS.background.tertiary,
                    borderWidth: 2,
                    borderColor:
                      currentLevel === option.level
                        ? COLORS.accent.primary
                        : COLORS.border.secondary,
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor:
                        currentLevel === option.level
                          ? `${COLORS.accent.primary}33`
                          : `${COLORS.text.tertiary}20`,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={20}
                      color={
                        currentLevel === option.level
                          ? COLORS.accent.primary
                          : COLORS.text.tertiary
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: COLORS.text.primary,
                      }}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: COLORS.text.tertiary,
                        marginTop: 2,
                      }}
                    >
                      {option.description}
                    </Text>
                  </View>
                  {currentLevel === option.level && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.accent.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}
