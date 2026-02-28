import {
  fixEnglishMistakes,
  predictConversationFlow,
} from "@/services/groqService";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface WordSuggestion {
  word: string;
  level: "beginner" | "intermediate" | "advanced";
  sentence: string;
  conversationStarters: string[];
}

interface ConversationFlow {
  theirResponse: string;
  yourFollowUp: string;
}

interface MistakeFix {
  original: string;
  corrected: string;
  explanation: string;
}

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [expandedStarter, setExpandedStarter] = useState<string | null>(null);
  const [conversationFlows, setConversationFlows] = useState<
    Record<string, ConversationFlow[]>
  >({});
  const [loadingStarter, setLoadingStarter] = useState<string | null>(null);
  const [userInput, setUserInput] = useState("");
  const [mistakeFix, setMistakeFix] = useState<MistakeFix | null>(null);
  const [isFixing, setIsFixing] = useState(false);

  const suggestions: WordSuggestion[] = params.suggestions
    ? JSON.parse(params.suggestions as string)
    : [];

  const handlePredictResponse = async (starter: string) => {
    if (conversationFlows[starter]) {
      setExpandedStarter(expandedStarter === starter ? null : starter);
      return;
    }

    setLoadingStarter(starter);
    try {
      const flows = await predictConversationFlow(starter);
      setConversationFlows((prev) => ({ ...prev, [starter]: flows }));
      setExpandedStarter(starter);
    } catch (error) {
      console.error("Error predicting conversation:", error);
    } finally {
      setLoadingStarter(null);
    }
  };

  const handleFixMistakes = async () => {
    if (!userInput.trim()) return;

    setIsFixing(true);
    try {
      const fix = await fixEnglishMistakes(userInput);
      setMistakeFix(fix);
    } catch (error) {
      console.error("Error fixing mistakes:", error);
    } finally {
      setIsFixing(false);
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

        <View style={styles.mistakeFixerCard}>
          <View style={styles.mistakeFixerHeader}>
            <Ionicons name="create" size={20} color="#8B5CF6" />
            <Text style={styles.mistakeFixerTitle}>Practice Your English</Text>
          </View>
          <Text style={styles.mistakeFixerSubtitle}>
            Type what you want to say, and I'll help make it sound natural
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., I want go to store buy milk..."
            placeholderTextColor="#9CA3AF"
            value={userInput}
            onChangeText={setUserInput}
            multiline
          />
          <TouchableOpacity
            onPress={handleFixMistakes}
            disabled={!userInput.trim() || isFixing}
            style={[
              styles.fixButton,
              (!userInput.trim() || isFixing) && styles.fixButtonDisabled,
            ]}
          >
            {isFixing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="sparkles" size={18} color="white" />
                <Text style={styles.fixButtonText}>Fix My English</Text>
              </>
            )}
          </TouchableOpacity>

          {mistakeFix && (
            <View style={styles.fixResultContainer}>
              <View style={styles.fixResultBox}>
                <Text style={styles.fixResultLabel}>
                  ✨ Better way to say it:
                </Text>
                <Text style={styles.fixResultText}>{mistakeFix.corrected}</Text>
              </View>
              <View style={styles.explanationBox}>
                <Text style={styles.explanationLabel}>💡 Why:</Text>
                <Text style={styles.explanationText}>
                  {mistakeFix.explanation}
                </Text>
              </View>
            </View>
          )}
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

            <View style={styles.conversationSection}>
              <View style={styles.conversationHeader}>
                <Ionicons name="chatbubbles" size={18} color="#3B82F6" />
                <Text style={styles.conversationTitle}>
                  Conversation Starters
                </Text>
              </View>
              {item.conversationStarters?.map((starter, idx) => (
                <View key={idx}>
                  <View style={styles.starterItem}>
                    <Text style={styles.starterBullet}>💬</Text>
                    <Text style={styles.starterText}>{starter}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handlePredictResponse(starter)}
                    style={styles.predictButton}
                    disabled={loadingStarter === starter}
                  >
                    {loadingStarter === starter ? (
                      <ActivityIndicator size="small" color="#3B82F6" />
                    ) : (
                      <>
                        <Ionicons
                          name={
                            expandedStarter === starter
                              ? "chevron-up"
                              : "chevron-down"
                          }
                          size={16}
                          color="#3B82F6"
                        />
                        <Text style={styles.predictButtonText}>
                          {conversationFlows[starter]
                            ? expandedStarter === starter
                              ? "Hide responses"
                              : "Show responses"
                            : "What might they say?"}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {expandedStarter === starter &&
                    conversationFlows[starter] && (
                      <View style={styles.flowContainer}>
                        {conversationFlows[starter].map((flow, flowIdx) => (
                          <View key={flowIdx} style={styles.flowItem}>
                            <View style={styles.responseBox}>
                              <Text style={styles.responseLabel}>
                                They might say:
                              </Text>
                              <Text style={styles.responseText}>
                                {flow.theirResponse}
                              </Text>
                            </View>
                            <View style={styles.followUpBox}>
                              <Text style={styles.followUpLabel}>
                                You could reply:
                              </Text>
                              <Text style={styles.followUpText}>
                                {flow.yourFollowUp}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                </View>
              ))}
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
  },
  conversationSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  conversationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  conversationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  starterItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  starterBullet: {
    fontSize: 14,
    marginTop: 2,
  },
  starterText: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  predictButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 30,
    marginTop: 4,
    marginBottom: 8,
  },
  predictButtonText: {
    fontSize: 13,
    color: "#3B82F6",
    fontWeight: "500",
  },
  flowContainer: {
    marginLeft: 30,
    marginTop: 8,
    gap: 12,
  },
  flowItem: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  responseBox: {
    gap: 4,
  },
  responseLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  responseText: {
    fontSize: 14,
    color: "#374151",
    fontStyle: "italic",
  },
  followUpBox: {
    gap: 4,
  },
  followUpLabel: {
    fontSize: 11,
    color: "#3B82F6",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  followUpText: {
    fontSize: 14,
    color: "#1F2937",
  },
  mistakeFixerCard: {
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
  mistakeFixerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  mistakeFixerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  mistakeFixerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: "#111827",
    minHeight: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  fixButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8B5CF6",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  fixButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  fixButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  fixResultContainer: {
    marginTop: 16,
    gap: 12,
  },
  fixResultBox: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  fixResultLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#059669",
    marginBottom: 8,
  },
  fixResultText: {
    fontSize: 16,
    color: "#065F46",
    lineHeight: 24,
  },
  explanationBox: {
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#6366F1",
  },
  explanationLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4F46E5",
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: "#3730A3",
    lineHeight: 20,
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
