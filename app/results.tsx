import { isWordSaved, saveWord } from "@/services/storageService";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface WordSuggestion {
  word: string;
  level: "beginner" | "intermediate" | "advanced";
  sentence: string;
}

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const suggestions: WordSuggestion[] = params.suggestions
    ? JSON.parse(params.suggestions as string)
    : [];

  const [savedStates, setSavedStates] = useState<{ [key: string]: boolean }>(
    {},
  );

  useEffect(() => {
    // Check which words are already saved
    const checkSavedWords = async () => {
      const states: { [key: string]: boolean } = {};
      for (const suggestion of suggestions) {
        states[suggestion.word] = await isWordSaved(suggestion.word);
      }
      setSavedStates(states);
    };
    checkSavedWords();
  }, []);

  const handleSave = async (
    word: string,
    level: "beginner" | "intermediate" | "advanced",
    sentence: string,
  ) => {
    try {
      const success = await saveWord(word, level, sentence);
      if (success) {
        setSavedStates((prev) => ({ ...prev, [word]: true }));
        Alert.alert("Success", `"${word}" has been saved to your collection!`);
      } else {
        Alert.alert(
          "Already Saved",
          `"${word}" is already in your collection.`,
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save the word. Please try again.");
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "#10B981";
      case "intermediate":
        return "#EAB308";
      case "advanced":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Word Suggestions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={48} color="#10B981" />
          <Text style={styles.successText}>Analysis Complete!</Text>
          <Text style={styles.successSubtext}>
            Here are {suggestions.length} vocabulary words for you
          </Text>
        </View>

        {suggestions.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.wordText}>{item.word}</Text>
              <View
                style={[
                  styles.levelBadge,
                  { backgroundColor: getLevelColor(item.level) },
                ]}
              >
                <Text style={styles.levelText}>{item.level}</Text>
              </View>
            </View>
            <Text style={styles.sentenceText}>{item.sentence}</Text>

            <View style={styles.cardFooter}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons
                  name="volume-high-outline"
                  size={20}
                  color="#3B82F6"
                />
                <Text style={styles.actionButtonText}>Listen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  savedStates[item.word] && styles.savedButton,
                ]}
                onPress={() => handleSave(item.word, item.level, item.sentence)}
                disabled={savedStates[item.word]}
              >
                <Ionicons
                  name={
                    savedStates[item.word] ? "bookmark" : "bookmark-outline"
                  }
                  size={20}
                  color={savedStates[item.word] ? "#10B981" : "#3B82F6"}
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    savedStates[item.word] && styles.savedButtonText,
                  ]}
                >
                  {savedStates[item.word] ? "Saved" : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.captureMoreButton}
        >
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.captureMoreText}>Capture More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  successBanner: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 12,
  },
  successSubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  wordText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  levelText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  sentenceText: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "600",
  },
  savedButton: {
    backgroundColor: "#D1FAE5",
  },
  savedButtonText: {
    color: "#10B981",
  },
  bottomBar: {
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  captureMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  captureMoreText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
