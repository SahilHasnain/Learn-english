import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ConversationFlow from "./ConversationFlow";

interface WordCardProps {
  word: string;
  level: "beginner" | "intermediate" | "advanced";
  sentence: string;
  conversationStarters: string[];
}

export default function WordCard({
  word,
  level,
  sentence,
  conversationStarters,
}: WordCardProps) {
  const [expandedStarter, setExpandedStarter] = useState<string | null>(null);

  const getLevelGradient = (level: string) => {
    switch (level) {
      case "beginner":
        return "#10B981";
      case "intermediate":
        return "#F59E0B";
      case "advanced":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const highlightWord = (sentence: string, word: string) => {
    const regex = new RegExp(`\\b(${word})\\b`, "gi");
    const parts = sentence.split(regex);

    return (
      <Text style={styles.sentenceText}>
        {parts.map((part, index) =>
          part.toLowerCase() === word.toLowerCase() ? (
            <Text key={index} style={styles.highlightedWord}>
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
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.wordContainer}>
          <Ionicons name="book-outline" size={20} color="#3B82F6" />
          <Text style={styles.wordText}>{word}</Text>
        </View>
        <View
          style={[
            styles.levelBadge,
            { backgroundColor: getLevelGradient(level) },
          ]}
        >
          <Text style={styles.levelText}>{level}</Text>
        </View>
      </View>

      <View style={styles.sentenceContainer}>
        <Ionicons
          name="chatbox-ellipses-outline"
          size={16}
          color="#9CA3AF"
          style={styles.quoteIcon}
        />
        {highlightWord(sentence, word)}
      </View>

      <View style={styles.conversationSection}>
        <View style={styles.conversationHeader}>
          <Ionicons name="chatbubbles" size={20} color="#3B82F6" />
          <Text style={styles.conversationTitle}>Start a Conversation</Text>
        </View>
        {conversationStarters?.map((starter, idx) => (
          <ConversationFlow
            key={idx}
            starter={starter}
            isExpanded={expandedStarter === starter}
            onToggle={() =>
              setExpandedStarter(expandedStarter === starter ? null : starter)
            }
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  wordContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  wordText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  levelBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  levelText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sentenceContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#3B82F6",
  },
  quoteIcon: {
    marginTop: 2,
  },
  sentenceText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    lineHeight: 26,
  },
  highlightedWord: {
    fontWeight: "700",
    color: "#2563EB",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  conversationSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  conversationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3B82F6",
  },
});
