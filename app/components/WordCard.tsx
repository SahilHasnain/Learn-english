import { COLORS, SHADOWS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";
import ConversationFlow from "./ConversationFlow";

interface WordCardProps {
  word: string;
  level: "beginner" | "intermediate" | "advanced";
  sentence: string;
  conversationStarter: string;
  hindiMeaning: string;
}

export default function WordCard({
  word,
  level,
  sentence,
  conversationStarter,
  hindiMeaning,
}: WordCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return COLORS.accent.success;
      case "intermediate":
        return COLORS.accent.warning;
      case "advanced":
        return COLORS.accent.error;
      default:
        return COLORS.text.disabled;
    }
  };

  const highlightWord = (sentence: string, word: string) => {
    const regex = new RegExp(`\\b(${word})\\b`, "gi");
    const parts = sentence.split(regex);

    return (
      <Text
        style={{
          fontSize: 16,
          color: COLORS.text.secondary,
          lineHeight: 26,
          flex: 1,
        }}
      >
        {parts.map((part, index) =>
          part.toLowerCase() === word.toLowerCase() ? (
            <Text
              key={index}
              style={{
                fontWeight: "700",
                color: COLORS.accent.primary,
                backgroundColor: `${COLORS.accent.primary}33`,
                paddingHorizontal: 6,
                paddingVertical: 3,
                borderRadius: 6,
              }}
            >
              {part}
            </Text>
          ) : (
            part
          ),
        )}
      </Text>
    );
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.background.secondary,
        borderRadius: 20,
        padding: 24,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border.subtle,
        ...SHADOWS.md,
      }}
    >
      {/* Card Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: SPACING.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            flex: 1,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: `${COLORS.accent.secondary}33`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="book-outline"
              size={20}
              color={COLORS.accent.secondary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: COLORS.text.primary,
              }}
            >
              {word}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.text.tertiary,
                fontStyle: "italic",
                marginTop: 2,
              }}
            >
              {hindiMeaning}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: getLevelColor(level),
            paddingHorizontal: 14,
            paddingVertical: 7,
            borderRadius: 12,
            ...SHADOWS.sm,
          }}
        >
          <Text
            style={{
              color: COLORS.text.primary,
              fontSize: 11,
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {level}
          </Text>
        </View>
      </View>

      {/* Sentence Container */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 8,
          backgroundColor: COLORS.background.tertiary,
          padding: SPACING.md,
          borderRadius: 12,
          borderLeftWidth: 3,
          borderLeftColor: COLORS.accent.secondary,
        }}
      >
        <Ionicons
          name="chatbox-ellipses-outline"
          size={16}
          color={COLORS.text.tertiary}
          style={{ marginTop: 2 }}
        />
        {highlightWord(sentence, word)}
      </View>

      {/* Conversation Section */}
      <View
        style={{
          marginTop: SPACING.lg,
          paddingTop: SPACING.lg,
          borderTopWidth: 1,
          borderTopColor: COLORS.border.subtle,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginBottom: SPACING.md,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: `${COLORS.accent.secondary}33`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="chatbubbles"
              size={16}
              color={COLORS.accent.secondary}
            />
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: COLORS.accent.secondary,
            }}
          >
            Start a Conversation
          </Text>
        </View>

        {conversationStarter && (
          <ConversationFlow
            starter={conversationStarter}
            isExpanded={isExpanded}
            onToggle={() => setIsExpanded(!isExpanded)}
          />
        )}
      </View>
    </View>
  );
}
