import { generateMicroStory } from "@/services/groqService";
import { getLearningLanguage } from "@/services/storageService";
import { COLORS, SHADOWS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface MicroStoryProps {
  words: { word: string; hindiMeaning: string }[];
}

export default function MicroStory({ words }: MicroStoryProps) {
  const [story, setStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const loadStory = useCallback(async () => {
    if (story) {
      setIsExpanded(!isExpanded);
      return;
    }
    setIsExpanded(true);
    setLoading(true);
    try {
      const language = await getLearningLanguage();
      const result = await generateMicroStory(words, language || "hindi");
      setStory(result);
    } catch (error) {
      console.error("Error loading micro story:", error);
      setStory(null);
    } finally {
      setLoading(false);
    }
  }, [words, story, isExpanded]);

  const renderStoryText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return (
      <Text
        style={{ fontSize: 16, lineHeight: 26, color: COLORS.text.secondary }}
      >
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <Text
                key={i}
                style={{
                  fontWeight: "800",
                  color: COLORS.accent.warning,
                }}
              >
                {part.slice(2, -2)}
              </Text>
            );
          }
          return part;
        })}
      </Text>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: `${COLORS.accent.warning}1A`,
          padding: SPACING.md,
          borderRadius: 16,
          marginBottom: SPACING.lg,
          borderWidth: 2,
          borderColor: `${COLORS.accent.warning}33`,
        }}
        onPress={loadStory}
        disabled={loading}
        activeOpacity={0.7}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            flex: 1,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: `${COLORS.accent.warning}33`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="book" size={20} color={COLORS.accent.warning} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: COLORS.accent.warning,
                marginBottom: 2,
              }}
            >
              Live the Words
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: COLORS.text.secondary,
              }}
            >
              A tiny story with all your words
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={COLORS.accent.warning} />
        ) : (
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={COLORS.accent.warning}
          />
        )}
      </TouchableOpacity>

      {isExpanded && story && (
        <View
          style={{
            backgroundColor: COLORS.background.secondary,
            borderRadius: 16,
            marginBottom: SPACING.lg,
            flexDirection: "row",
            overflow: "hidden",
            borderWidth: 1,
            borderColor: COLORS.border.subtle,
            ...SHADOWS.md,
          }}
        >
          <View
            style={{
              width: 4,
              backgroundColor: COLORS.accent.warning,
            }}
          />
          <View style={{ flex: 1, padding: SPACING.lg }}>
            {renderStoryText(story)}
          </View>
        </View>
      )}
    </>
  );
}
