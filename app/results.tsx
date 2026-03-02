import EnglishPracticeChat from "@/app/components/EnglishPracticeChat";
import { predictConversationFlow } from "@/services/groqService";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
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
  conversationStarters: string[];
}

interface ConversationFlow {
  theirResponse: string;
  yourFollowUp: string;
}

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [expandedStarter, setExpandedStarter] = useState<string | null>(null);
  const [conversationFlows, setConversationFlows] = useState<
    Record<string, ConversationFlow[]>
  >({});
  const [loadingStarter, setLoadingStarter] = useState<string | null>(null);
  const [flowReactions, setFlowReactions] = useState<
    Record<string, "up" | "down" | null>
  >({});
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);

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

  const handleReaction = (flowKey: string, reaction: "up" | "down") => {
    setFlowReactions((prev) => ({
      ...prev,
      [flowKey]: prev[flowKey] === reaction ? null : reaction,
    }));
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

  const getLevelGradient = (level: string) => {
    switch (level) {
      case "beginner":
        return ["#10B981", "#059669"];
      case "intermediate":
        return ["#F59E0B", "#D97706"];
      case "advanced":
        return ["#EF4444", "#DC2626"];
      default:
        return ["#6B7280", "#4B5563"];
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
        <View style={styles.compactHeader}>
          <View style={styles.compactHeaderLeft}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.compactHeaderText}>
              {suggestions.length} {suggestions.length === 1 ? "word" : "words"}{" "}
              found
            </Text>
          </View>
          <View style={styles.successBadge}>
            <Text style={styles.successBadgeText}>Ready to learn</Text>
          </View>
        </View>

        {suggestions.map((item, index) => {
          const [gradientStart] = getLevelGradient(item.level);
          return (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.wordContainer}>
                  <Ionicons name="book-outline" size={20} color="#3B82F6" />
                  <Text style={styles.wordText}>{item.word}</Text>
                </View>
                <View
                  style={[
                    styles.levelBadge,
                    { backgroundColor: gradientStart },
                  ]}
                >
                  <Text style={styles.levelText}>{item.level}</Text>
                </View>
              </View>

              <View style={styles.sentenceContainer}>
                <Ionicons
                  name="chatbox-ellipses-outline"
                  size={16}
                  color="#9CA3AF"
                  style={styles.quoteIcon}
                />
                {highlightWord(item.sentence, item.word)}
              </View>

              <View style={styles.conversationSection}>
                <View style={styles.conversationHeader}>
                  <Ionicons name="chatbubbles" size={20} color="#3B82F6" />
                  <Text style={styles.conversationTitle}>
                    Start a Conversation
                  </Text>
                </View>
                {item.conversationStarters?.map((starter, idx) => (
                  <View key={idx} style={styles.starterWrapper}>
                    <TouchableOpacity
                      onPress={() => handlePredictResponse(starter)}
                      style={styles.starterCard}
                      disabled={loadingStarter === starter}
                    >
                      <View style={styles.starterContent}>
                        <View style={styles.starterIconContainer}>
                          <Ionicons
                            name="chatbubble-ellipses"
                            size={18}
                            color="#3B82F6"
                          />
                        </View>
                        <Text style={styles.starterText}>{starter}</Text>
                      </View>
                      {loadingStarter === starter ? (
                        <ActivityIndicator size="small" color="#3B82F6" />
                      ) : (
                        <Ionicons
                          name={
                            expandedStarter === starter
                              ? "chevron-up-circle"
                              : "chevron-down-circle"
                          }
                          size={24}
                          color="#3B82F6"
                        />
                      )}
                    </TouchableOpacity>

                    {expandedStarter === starter &&
                      conversationFlows[starter] && (
                        <View style={styles.flowContainer}>
                          {conversationFlows[starter].map((flow, flowIdx) => {
                            const flowKey = `${starter}-${flowIdx}`;
                            return (
                              <View key={flowIdx} style={styles.flowItem}>
                                <View style={styles.responseBox}>
                                  <View style={styles.flowLabelContainer}>
                                    <Ionicons
                                      name="person"
                                      size={14}
                                      color="#6366F1"
                                    />
                                    <Text style={styles.responseLabel}>
                                      They might say
                                    </Text>
                                  </View>
                                  <Text style={styles.responseText}>
                                    {flow.theirResponse}
                                  </Text>
                                </View>
                                <View style={styles.flowArrow}>
                                  <Ionicons
                                    name="arrow-down"
                                    size={16}
                                    color="#9CA3AF"
                                  />
                                </View>
                                <View style={styles.followUpBox}>
                                  <View style={styles.flowLabelContainer}>
                                    <Ionicons
                                      name="person-circle"
                                      size={14}
                                      color="#10B981"
                                    />
                                    <Text style={styles.followUpLabel}>
                                      You could reply
                                    </Text>
                                  </View>
                                  <Text style={styles.followUpText}>
                                    {flow.yourFollowUp}
                                  </Text>
                                </View>
                                <View style={styles.reactionContainer}>
                                  <Text style={styles.reactionPrompt}>
                                    Helpful?
                                  </Text>
                                  <View style={styles.reactionButtons}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleReaction(flowKey, "up")
                                      }
                                      style={[
                                        styles.reactionButton,
                                        flowReactions[flowKey] === "up" &&
                                          styles.reactionButtonActive,
                                      ]}
                                    >
                                      <Text
                                        style={[
                                          styles.reactionEmoji,
                                          flowReactions[flowKey] === "up" &&
                                            styles.reactionEmojiActive,
                                        ]}
                                      >
                                        👍
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleReaction(flowKey, "down")
                                      }
                                      style={[
                                        styles.reactionButton,
                                        flowReactions[flowKey] === "down" &&
                                          styles.reactionButtonActive,
                                      ]}
                                    >
                                      <Text
                                        style={[
                                          styles.reactionEmoji,
                                          flowReactions[flowKey] === "down" &&
                                            styles.reactionEmojiActive,
                                        ]}
                                      >
                                        👎
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      )}
                  </View>
                ))}
              </View>
            </View>
          );
        })}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsChatModalVisible(true)}
      >
        <Ionicons name="chatbubbles" size={28} color="white" />
      </TouchableOpacity>

      <Modal
        visible={isChatModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsChatModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Ionicons name="sparkles" size={24} color="#8B5CF6" />
                <Text style={styles.modalTitle}>Practice English</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsChatModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close-circle" size={32} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <EnglishPracticeChat />
            </ScrollView>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.captureMoreButton}
      >
        <Ionicons name="camera" size={24} color="white" />
        <Text style={styles.captureMoreText}>Capture More</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
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
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  compactHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  compactHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  compactHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  successBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  successBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
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
  starterWrapper: {
    marginBottom: 12,
  },
  starterCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  starterContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  starterIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  starterText: {
    flex: 1,
    fontSize: 15,
    color: "#1E293B",
    lineHeight: 22,
    fontWeight: "500",
  },
  flowContainer: {
    marginTop: 12,
    gap: 16,
  },
  flowItem: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  responseBox: {
    gap: 8,
  },
  flowLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  responseLabel: {
    fontSize: 12,
    color: "#6366F1",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  responseText: {
    fontSize: 15,
    color: "#475569",
    fontStyle: "italic",
    lineHeight: 22,
    paddingLeft: 20,
  },
  flowArrow: {
    alignItems: "center",
    paddingVertical: 8,
  },
  followUpBox: {
    gap: 8,
  },
  followUpLabel: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  followUpText: {
    fontSize: 15,
    color: "#1F2937",
    lineHeight: 22,
    fontWeight: "500",
    paddingLeft: 20,
  },
  reactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  reactionPrompt: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  reactionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  reactionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  reactionButtonActive: {
    backgroundColor: "#DBEAFE",
    borderColor: "#3B82F6",
  },
  reactionEmoji: {
    fontSize: 20,
    opacity: 0.4,
  },
  reactionEmojiActive: {
    opacity: 1,
  },
  bottomPadding: {
    height: 80,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "85%",
    paddingTop: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  modalScroll: {
    padding: 24,
  },
  captureMoreButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 18,
    gap: 10,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  captureMoreText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
});
