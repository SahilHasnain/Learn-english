import KeyboardSpacer from "@/app/components/KeyboardSpacer";
import {
  fixEnglishMistakes,
  generateReverseChallenge,
} from "@/services/groqService";
import { getLearningLanguage } from "@/services/storageService";
import { COLORS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface MistakeFix {
  original: string;
  corrected: string;
  explanation: string;
}

interface ReverseChallenge {
  prompt: string;
  hint: string;
  answer: string;
}

type PracticeTab = "fix" | "translate";

export default function EnglishPracticeChat() {
  const [activeTab, setActiveTab] = useState<PracticeTab>("fix");
  const [language, setLanguage] = useState<string>("hindi");

  // Fix tab state
  const [userInput, setUserInput] = useState("");
  const [mistakeFix, setMistakeFix] = useState<MistakeFix | null>(null);
  const [isFixing, setIsFixing] = useState(false);

  // Translate tab state
  const [challenge, setChallenge] = useState<ReverseChallenge | null>(null);
  const [translateInput, setTranslateInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const lang = await getLearningLanguage();
    setLanguage(lang || "hindi");
  };

  const handleFixMistakes = async () => {
    if (!userInput.trim()) return;

    Keyboard.dismiss();
    setIsFixing(true);
    try {
      const fix = await fixEnglishMistakes(userInput, language);
      setMistakeFix(fix);
    } catch (error) {
      console.error("Error fixing mistakes:", error);
    } finally {
      setIsFixing(false);
    }
  };

  const loadChallenge = async () => {
    setIsLoadingChallenge(true);
    setShowAnswer(false);
    setTranslateInput("");
    try {
      const result = await generateReverseChallenge(language);
      setChallenge(result);
    } catch (error) {
      console.error("Error loading challenge:", error);
    } finally {
      setIsLoadingChallenge(false);
    }
  };

  const handleCheckTranslation = async () => {
    if (!translateInput.trim() || !challenge) return;
    Keyboard.dismiss();
    setIsFixing(true);
    try {
      const fix = await fixEnglishMistakes(translateInput, language);
      setMistakeFix(fix);
      setShowAnswer(true);
    } catch (error) {
      console.error("Error checking translation:", error);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Tab Switcher */}
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: SPACING.lg,
          marginTop: SPACING.sm,
          marginBottom: SPACING.sm,
          backgroundColor: COLORS.background.tertiary,
          borderRadius: 12,
          padding: 4,
        }}
      >
        <TouchableOpacity
          onPress={() => setActiveTab("fix")}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor:
              activeTab === "fix" ? COLORS.accent.primary : "transparent",
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color:
                activeTab === "fix"
                  ? COLORS.text.primary
                  : COLORS.text.tertiary,
            }}
          >
            Fix My English
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab("translate");
            if (!challenge) loadChallenge();
          }}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor:
              activeTab === "translate"
                ? COLORS.accent.secondary
                : "transparent",
          }}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color:
                activeTab === "translate"
                  ? COLORS.text.primary
                  : COLORS.text.tertiary,
            }}
          >
            Translate Challenge
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "fix" ? (
        <>
          {/* Fix Tab Content */}
          <View style={{ flex: 1 }}>
            {!mistakeFix && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: SPACING.lg,
                }}
              >
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: `${COLORS.accent.primary}1A`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Ionicons
                    name="create"
                    size={28}
                    color={COLORS.accent.primary}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.text.secondary,
                    textAlign: "center",
                    lineHeight: 24,
                  }}
                >
                  Type what you want to say, and I&apos;ll help make it sound
                  natural
                </Text>
              </View>
            )}

            {mistakeFix && (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: SPACING.lg, gap: 12 }}
                showsVerticalScrollIndicator={false}
              >
                <View
                  style={{
                    backgroundColor: `${COLORS.accent.success}1A`,
                    borderRadius: 12,
                    padding: SPACING.md,
                    borderLeftWidth: 4,
                    borderLeftColor: COLORS.accent.success,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: COLORS.accent.success,
                      marginBottom: 8,
                    }}
                  >
                    ✨ Better way to say it:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.text.primary,
                      lineHeight: 24,
                    }}
                  >
                    {mistakeFix.corrected}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: `${COLORS.accent.info}1A`,
                    borderRadius: 12,
                    padding: SPACING.md,
                    borderLeftWidth: 4,
                    borderLeftColor: COLORS.accent.info,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: COLORS.accent.info,
                      marginBottom: 8,
                    }}
                  >
                    💡 Why:
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.text.secondary,
                      lineHeight: 20,
                    }}
                  >
                    {mistakeFix.explanation}
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>

          {/* Fix Tab Input */}
          <View
            style={{
              paddingHorizontal: SPACING.lg,
              paddingVertical: SPACING.md,
              borderTopWidth: 1,
              borderTopColor: COLORS.border.subtle,
              backgroundColor: COLORS.background.secondary,
            }}
          >
            <TextInput
              style={{
                backgroundColor: COLORS.background.tertiary,
                borderRadius: 12,
                padding: SPACING.md,
                fontSize: 15,
                color: COLORS.text.primary,
                minHeight: 56,
                maxHeight: 120,
                textAlignVertical: "top",
                borderWidth: 1,
                borderColor: COLORS.border.primary,
                marginBottom: 10,
              }}
              placeholder="e.g., I want go to store buy milk..."
              placeholderTextColor={COLORS.text.disabled}
              value={userInput}
              onChangeText={setUserInput}
              multiline
            />

            <TouchableOpacity
              onPress={handleFixMistakes}
              disabled={!userInput.trim() || isFixing}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  !userInput.trim() || isFixing
                    ? COLORS.interactive.disabled
                    : COLORS.accent.primary,
                paddingVertical: 14,
                borderRadius: 12,
                gap: 8,
              }}
              activeOpacity={0.8}
            >
              {isFixing ? (
                <ActivityIndicator size="small" color={COLORS.text.primary} />
              ) : (
                <>
                  <Ionicons
                    name="sparkles"
                    size={18}
                    color={COLORS.text.primary}
                  />
                  <Text
                    style={{
                      color: COLORS.text.primary,
                      fontSize: 15,
                      fontWeight: "600",
                    }}
                  >
                    Fix My English
                  </Text>
                </>
              )}
            </TouchableOpacity>
            <KeyboardSpacer />
          </View>
        </>
      ) : (
        <>
          {/* Translate Tab Content */}
          <View style={{ flex: 1 }}>
            {isLoadingChallenge && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator
                  size="large"
                  color={COLORS.accent.secondary}
                />
                <Text
                  style={{
                    color: COLORS.text.tertiary,
                    marginTop: 12,
                    fontSize: 14,
                  }}
                >
                  Loading challenge...
                </Text>
              </View>
            )}

            {!isLoadingChallenge && !challenge && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: SPACING.lg,
                }}
              >
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: `${COLORS.accent.secondary}1A`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Ionicons
                    name="swap-horizontal"
                    size={28}
                    color={COLORS.accent.secondary}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.text.secondary,
                    textAlign: "center",
                    lineHeight: 24,
                  }}
                >
                  Translate sentences into English to practice
                </Text>
              </View>
            )}

            {!isLoadingChallenge && challenge && (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: SPACING.lg, gap: 12 }}
                showsVerticalScrollIndicator={false}
              >
                {/* Challenge Prompt */}
                <View
                  style={{
                    backgroundColor: `${COLORS.accent.secondary}1A`,
                    borderRadius: 12,
                    padding: SPACING.md,
                    borderLeftWidth: 4,
                    borderLeftColor: COLORS.accent.secondary,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: COLORS.accent.secondary,
                      marginBottom: 8,
                    }}
                  >
                    🗣️ Say this in English:
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      color: COLORS.text.primary,
                      lineHeight: 28,
                      fontWeight: "600",
                    }}
                  >
                    {challenge.prompt}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.text.tertiary,
                      marginTop: 8,
                    }}
                  >
                    💡 Hint: {challenge.hint}
                  </Text>
                </View>

                {/* Show answer + correction after checking */}
                {showAnswer && (
                  <>
                    <View
                      style={{
                        backgroundColor: `${COLORS.accent.success}1A`,
                        borderRadius: 12,
                        padding: SPACING.md,
                        borderLeftWidth: 4,
                        borderLeftColor: COLORS.accent.success,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: COLORS.accent.success,
                          marginBottom: 8,
                        }}
                      >
                        ✅ Correct answer:
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: COLORS.text.primary,
                          lineHeight: 24,
                        }}
                      >
                        {challenge.answer}
                      </Text>
                    </View>

                    {mistakeFix && (
                      <>
                        <View
                          style={{
                            backgroundColor: `${COLORS.accent.primary}1A`,
                            borderRadius: 12,
                            padding: SPACING.md,
                            borderLeftWidth: 4,
                            borderLeftColor: COLORS.accent.primary,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: "600",
                              color: COLORS.accent.primary,
                              marginBottom: 8,
                            }}
                          >
                            ✨ Your corrected version:
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              color: COLORS.text.primary,
                              lineHeight: 24,
                            }}
                          >
                            {mistakeFix.corrected}
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: `${COLORS.accent.info}1A`,
                            borderRadius: 12,
                            padding: SPACING.md,
                            borderLeftWidth: 4,
                            borderLeftColor: COLORS.accent.info,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: "600",
                              color: COLORS.accent.info,
                              marginBottom: 8,
                            }}
                          >
                            💡 Why:
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: COLORS.text.secondary,
                              lineHeight: 20,
                            }}
                          >
                            {mistakeFix.explanation}
                          </Text>
                        </View>
                      </>
                    )}

                    <TouchableOpacity
                      onPress={loadChallenge}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: COLORS.accent.secondary,
                        paddingVertical: 14,
                        borderRadius: 12,
                        gap: 8,
                        marginTop: 4,
                      }}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name="refresh"
                        size={18}
                        color={COLORS.text.primary}
                      />
                      <Text
                        style={{
                          color: COLORS.text.primary,
                          fontSize: 15,
                          fontWeight: "600",
                        }}
                      >
                        Next Challenge
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
            )}
          </View>

          {/* Translate Tab Input */}
          {challenge && !showAnswer && (
            <View
              style={{
                paddingHorizontal: SPACING.lg,
                paddingVertical: SPACING.md,
                borderTopWidth: 1,
                borderTopColor: COLORS.border.subtle,
                backgroundColor: COLORS.background.secondary,
              }}
            >
              <TextInput
                style={{
                  backgroundColor: COLORS.background.tertiary,
                  borderRadius: 12,
                  padding: SPACING.md,
                  fontSize: 15,
                  color: COLORS.text.primary,
                  minHeight: 56,
                  maxHeight: 120,
                  textAlignVertical: "top",
                  borderWidth: 1,
                  borderColor: COLORS.border.primary,
                  marginBottom: 10,
                }}
                placeholder="Type your English translation..."
                placeholderTextColor={COLORS.text.disabled}
                value={translateInput}
                onChangeText={setTranslateInput}
                multiline
              />

              <TouchableOpacity
                onPress={handleCheckTranslation}
                disabled={!translateInput.trim() || isFixing}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    !translateInput.trim() || isFixing
                      ? COLORS.interactive.disabled
                      : COLORS.accent.secondary,
                  paddingVertical: 14,
                  borderRadius: 12,
                  gap: 8,
                }}
                activeOpacity={0.8}
              >
                {isFixing ? (
                  <ActivityIndicator size="small" color={COLORS.text.primary} />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={COLORS.text.primary}
                    />
                    <Text
                      style={{
                        color: COLORS.text.primary,
                        fontSize: 15,
                        fontWeight: "600",
                      }}
                    >
                      Check My Translation
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              <KeyboardSpacer />
            </View>
          )}
        </>
      )}
    </View>
  );
}
