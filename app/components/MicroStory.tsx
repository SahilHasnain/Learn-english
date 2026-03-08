import { generateMicroStory } from "@/services/groqService";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
      const result = await generateMicroStory(words);
      setStory(result);
    } catch (error) {
      console.error("Error loading micro story:", error);
      setStory(null);
    } finally {
      setLoading(false);
    }
  }, [words, story, isExpanded]);

  const renderStoryText = (text: string) => {
    // Split by **bold** markers and render with styling
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return (
      <Text style={styles.storyText}>
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <Text key={i} style={styles.boldWord}>
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
        style={styles.button}
        onPress={loadStory}
        disabled={loading}
      >
        <View style={styles.buttonContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="book" size={20} color="#D97706" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.buttonTitle}>Live the Words</Text>
            <Text style={styles.buttonSubtitle}>
              A tiny story with all your words
            </Text>
          </View>
        </View>
        {loading ? (
          <ActivityIndicator size="small" color="#D97706" />
        ) : (
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#D97706"
          />
        )}
      </TouchableOpacity>

      {isExpanded && story && (
        <View style={styles.storyCard}>
          <View style={styles.quoteBar} />
          <View style={styles.storyContent}>{renderStoryText(story)}</View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFBEB",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#FDE68A",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#B45309",
    marginBottom: 2,
  },
  buttonSubtitle: {
    fontSize: 13,
    color: "#D97706",
  },
  storyCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: "row",
    shadowColor: "#D97706",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  quoteBar: {
    width: 4,
    backgroundColor: "#F59E0B",
  },
  storyContent: {
    flex: 1,
    padding: 20,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 26,
    color: "#374151",
  },
  boldWord: {
    fontWeight: "800",
    color: "#B45309",
  },
});
