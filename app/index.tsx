import Flashback from "@/app/components/Flashback";
import { getTodayStats } from "@/services/learningJourneyService";
import {
  EnglishLevel,
  LearningLanguage,
  getEnglishLevel,
  getLearningLanguage,
  saveEnglishLevel,
  saveLearningLanguage,
} from "@/services/storageService";
import { COLORS, SHADOWS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Link, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function Index() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [onboardingStep, setOnboardingStep] = useState<"language" | "level">(
    "language",
  );
  const [currentLevel, setCurrentLevel] = useState<EnglishLevel | null>(null);
  const [currentLanguage, setCurrentLanguage] =
    useState<LearningLanguage | null>(null);
  const [stats, setStats] = useState({
    wordsToday: 0,
    totalWords: 0,
    streak: 0,
  });

  const snapPoints = useMemo(() => ["55%"], []);

  useEffect(() => {
    loadStats();
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const language = await getLearningLanguage();
    const level = await getEnglishLevel();
    setCurrentLanguage(language);
    setCurrentLevel(level);
    if (!language) {
      setOnboardingStep("language");
      bottomSheetRef.current?.expand();
    } else if (!level) {
      setOnboardingStep("level");
      bottomSheetRef.current?.expand();
    }
  };

  const handleLanguageSelect = async (language: LearningLanguage) => {
    await saveLearningLanguage(language);
    setCurrentLanguage(language);
    setOnboardingStep("level");
  };

  const handleLevelSelect = async (level: EnglishLevel) => {
    await saveEnglishLevel(level);
    setCurrentLevel(level);
    bottomSheetRef.current?.close();
  };

  const openSettings = () => {
    setOnboardingStep("language");
    bottomSheetRef.current?.expand();
  };

  const handleSheetChanges = useCallback((index: number) => {
    // -1 means closed
  }, []);

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

  const loadStats = async () => {
    const data = await getTodayStats();
    setStats(data);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.background.primary }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background.primary}
      />

      {/* Compact Header - Icon and Brand Inline */}
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
            onPress={openSettings}
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

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: SPACING.lg,
          flexGrow: 1,
          justifyContent: "flex-end",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Card */}
        {stats.totalWords > 0 && (
          <TouchableOpacity
            onPress={() => router.push("/journey")}
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
                {stats.totalWords}
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

            {stats.streak > 0 && (
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
                    {stats.streak}
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

            {stats.wordsToday > 0 && (
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
                    {stats.wordsToday}
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
        )}

        {/* Flashback - passive recall */}
        {stats.totalWords > 0 && <Flashback />}

        {/* Action Buttons */}
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
              onPress={() => router.push("/journey")}
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
              onPress={() => router.push("/practice")}
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

        {/* Bottom Spacing */}
        <View style={{ height: SPACING.xl }} />
      </ScrollView>

      {/* Onboarding Bottom Sheet - 2 Steps: Language → Level */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
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
                    onPress={() => handleLanguageSelect(option.language)}
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
                    onPress={() => handleLevelSelect(option.level)}
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
    </SafeAreaView>
  );
}
