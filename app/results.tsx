import EnglishPracticeChat from "@/app/components/EnglishPracticeChat";
import KeyboardSpacer from "@/app/components/KeyboardSpacer";
import MicroStory from "@/app/components/MicroStory";
import RelatedWordsSection from "@/app/components/RelatedWordsSection";
import WordCard from "@/app/components/WordCard";
import { saveLearnedWords } from "@/services/learningJourneyService";
import { COLORS, SHADOWS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface WordSuggestion {
  word: string;
  level: "beginner" | "intermediate" | "advanced";
  sentence: string;
  conversationStarters: string[];
  hindiMeaning: string;
}

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);

  const suggestions: WordSuggestion[] = useMemo(
    () => (params.suggestions ? JSON.parse(params.suggestions as string) : []),
    [params.suggestions],
  );

  const words = useMemo(() => suggestions.map((s) => s.word), [suggestions]);

  useEffect(() => {
    if (suggestions.length > 0) {
      // Save learned words to journey
      const learnedWords = suggestions.map((s) => ({
        word: s.word,
        hindiMeaning: s.hindiMeaning,
        level: s.level,
        timestamp: Date.now(),
      }));
      saveLearnedWords(learnedWords);
    }
  }, [suggestions]);

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
          justifyContent: "space-between",
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.md,
          backgroundColor: COLORS.background.secondary,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border.subtle,
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

        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: COLORS.text.primary,
          }}
        >
          Word Suggestions
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/journey")}
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
          <Ionicons
            name="map-outline"
            size={24}
            color={COLORS.accent.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={{
          flex: 1,
          paddingTop: SPACING.md,
          paddingHorizontal: SPACING.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header Card */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: COLORS.background.tertiary,
            paddingVertical: 14,
            paddingHorizontal: SPACING.md,
            borderRadius: 12,
            marginBottom: SPACING.lg,
            borderWidth: 1,
            borderColor: COLORS.border.secondary,
            ...SHADOWS.sm,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: `${COLORS.accent.success}33`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={COLORS.accent.success}
              />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: COLORS.text.primary,
              }}
            >
              {suggestions.length} {suggestions.length === 1 ? "word" : "words"}{" "}
              found
            </Text>
          </View>

          <View
            style={{
              backgroundColor: `${COLORS.accent.success}20`,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: `${COLORS.accent.success}40`,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "600",
                color: COLORS.accent.success,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Ready to learn
            </Text>
          </View>
        </View>

        {/* Related Words Section */}
        <RelatedWordsSection words={words} />

        {/* Micro Story */}
        <MicroStory
          words={suggestions.map((s) => ({
            word: s.word,
            hindiMeaning: s.hindiMeaning,
          }))}
        />

        {/* Word Cards */}
        {suggestions.map((item, index) => (
          <WordCard
            key={index}
            word={item.word}
            level={item.level}
            sentence={item.sentence}
            conversationStarters={item.conversationStarters}
            hindiMeaning={item.hindiMeaning}
          />
        ))}

        {/* Capture More Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.background.elevated,
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            gap: 8,
            marginTop: SPACING.lg,
            borderWidth: 1,
            borderColor: COLORS.border.primary,
            ...SHADOWS.md,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="camera" size={20} color={COLORS.text.primary} />
          <Text
            style={{
              color: COLORS.text.primary,
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            Capture More
          </Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 20,
          bottom: 100,
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: COLORS.accent.primary,
          alignItems: "center",
          justifyContent: "center",
          ...SHADOWS.accent,
        }}
        onPress={() => setIsChatModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubbles" size={28} color={COLORS.text.primary} />
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal
        visible={isChatModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsChatModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.overlay.dark,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.background.secondary,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              maxHeight: "85%",
              paddingTop: 8,
            }}
          >
            {/* Modal Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: SPACING.lg,
                paddingVertical: SPACING.lg,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.border.subtle,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: `${COLORS.accent.primary}33`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="sparkles"
                    size={20}
                    color={COLORS.accent.primary}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: COLORS.text.primary,
                  }}
                >
                  Practice English
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setIsChatModalVisible(false)}
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
                <Ionicons name="close" size={24} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <ScrollView
              style={{ padding: SPACING.lg }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <EnglishPracticeChat />
              <KeyboardSpacer />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
