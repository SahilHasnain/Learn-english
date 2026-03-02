import { predictConversationFlow } from "@/services/groqService";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ConversationFlowProps {
  starter: string;
  isExpanded: boolean;
  onToggle: () => void;
}

interface Flow {
  theirResponse: string;
  yourFollowUp: string;
}

export default function ConversationFlow({
  starter,
  isExpanded,
  onToggle,
}: ConversationFlowProps) {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(false);
  const [reactions, setReactions] = useState<
    Record<number, "up" | "down" | null>
  >({});

  const handleToggle = async () => {
    if (!flows.length && !isExpanded) {
      setLoading(true);
      try {
        const result = await predictConversationFlow(starter);
        setFlows(result);
        onToggle();
      } catch (error) {
        console.error("Error predicting conversation:", error);
      } finally {
        setLoading(false);
      }
    } else {
      onToggle();
    }
  };

  const handleReaction = (index: number, reaction: "up" | "down") => {
    setReactions((prev) => ({
      ...prev,
      [index]: prev[index] === reaction ? null : reaction,
    }));
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={handleToggle}
        style={styles.starterCard}
        disabled={loading}
      >
        <View style={styles.starterContent}>
          <View style={styles.starterIconContainer}>
            <Ionicons name="chatbubble-ellipses" size={18} color="#3B82F6" />
          </View>
          <Text style={styles.starterText}>{starter}</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="small" color="#3B82F6" />
        ) : (
          <Ionicons
            name={isExpanded ? "chevron-up-circle" : "chevron-down-circle"}
            size={24}
            color="#3B82F6"
          />
        )}
      </TouchableOpacity>

      {isExpanded && flows.length > 0 && (
        <View style={styles.flowContainer}>
          {flows.map((flow, idx) => (
            <View key={idx} style={styles.flowItem}>
              <View style={styles.responseBox}>
                <View style={styles.flowLabelContainer}>
                  <Ionicons name="person" size={14} color="#6366F1" />
                  <Text style={styles.responseLabel}>They might say</Text>
                </View>
                <Text style={styles.responseText}>{flow.theirResponse}</Text>
              </View>
              <View style={styles.flowArrow}>
                <Ionicons name="arrow-down" size={16} color="#9CA3AF" />
              </View>
              <View style={styles.followUpBox}>
                <View style={styles.flowLabelContainer}>
                  <Ionicons name="person-circle" size={14} color="#10B981" />
                  <Text style={styles.followUpLabel}>You could reply</Text>
                </View>
                <Text style={styles.followUpText}>{flow.yourFollowUp}</Text>
              </View>
              <View style={styles.reactionContainer}>
                <Text style={styles.reactionPrompt}>Helpful?</Text>
                <View style={styles.reactionButtons}>
                  <TouchableOpacity
                    onPress={() => handleReaction(idx, "up")}
                    style={[
                      styles.reactionButton,
                      reactions[idx] === "up" && styles.reactionButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.reactionEmoji,
                        reactions[idx] === "up" && styles.reactionEmojiActive,
                      ]}
                    >
                      👍
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleReaction(idx, "down")}
                    style={[
                      styles.reactionButton,
                      reactions[idx] === "down" && styles.reactionButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.reactionEmoji,
                        reactions[idx] === "down" && styles.reactionEmojiActive,
                      ]}
                    >
                      👎
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
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
});
