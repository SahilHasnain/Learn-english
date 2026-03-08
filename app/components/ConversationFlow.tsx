import { predictConversationFlow } from "@/services/groqService";
import { COLORS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ActivityIndicator,
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
    <View style={{ marginBottom: 12 }}>
      {/* Starter Card */}
      <TouchableOpacity
        onPress={handleToggle}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: COLORS.background.tertiary,
          padding: SPACING.md,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: COLORS.border.secondary,
        }}
        disabled={loading}
        activeOpacity={0.7}
      >
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}>
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: `${COLORS.accent.secondary}33`,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="chatbubble-ellipses" size={18} color={COLORS.accent.secondary} />
          </View>
          <Text style={{
            flex: 1,
            fontSize: 15,
            color: COLORS.text.primary,
            lineHeight: 22,
            fontWeight: '500',
          }}>
            {starter}
          </Text>
        </View>
        
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.accent.secondary} />
        ) : (
          <Ionicons
            name={isExpanded ? "chevron-up-circle" : "chevron-down-circle"}
            size={24}
            color={COLORS.accent.secondary}
          />
        )}
      </TouchableOpacity>

      {/* Flow Container */}
      {isExpanded && flows.length > 0 && (
        <View style={{ marginTop: 12, gap: SPACING.md }}>
          {flows.map((flow, idx) => (
            <View 
              key={idx} 
              style={{
                backgroundColor: COLORS.background.elevated,
                borderRadius: 16,
                padding: SPACING.md,
                borderWidth: 1,
                borderColor: COLORS.border.primary,
              }}
            >
              {/* Their Response */}
              <View style={{ gap: 8 }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: `${COLORS.accent.info}33`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Ionicons name="person" size={12} color={COLORS.accent.info} />
                  </View>
                  <Text style={{
                    fontSize: 12,
                    color: COLORS.accent.info,
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    They might say
                  </Text>
                </View>
                <Text style={{
                  fontSize: 15,
                  color: COLORS.text.secondary,
                  fontStyle: 'italic',
                  lineHeight: 22,
                  paddingLeft: 30,
                }}>
                  {flow.theirResponse}
                </Text>
              </View>
              
              {/* Arrow */}
              <View style={{
                alignItems: 'center',
                paddingVertical: 8,
              }}>
                <Ionicons name="arrow-down" size={16} color={COLORS.text.disabled} />
              </View>
              
              {/* Your Follow Up */}
              <View style={{ gap: 8 }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: `${COLORS.accent.success}33`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Ionicons name="person-circle" size={12} color={COLORS.accent.success} />
                  </View>
                  <Text style={{
                    fontSize: 12,
                    color: COLORS.accent.success,
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    You could reply
                  </Text>
                </View>
                <Text style={{
                  fontSize: 15,
                  color: COLORS.text.primary,
                  lineHeight: 22,
                  fontWeight: '500',
                  paddingLeft: 30,
                }}>
                  {flow.yourFollowUp}
                </Text>
              </View>
              
              {/* Reaction Buttons */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: SPACING.md,
                paddingTop: SPACING.md,
                borderTopWidth: 1,
                borderTopColor: COLORS.border.subtle,
              }}>
                <Text style={{
                  fontSize: 13,
                  color: COLORS.text.tertiary,
                  fontWeight: '500',
                }}>
                  Helpful?
                </Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => handleReaction(idx, "up")}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: reactions[idx] === "up" 
                        ? `${COLORS.accent.success}33` 
                        : COLORS.background.tertiary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderColor: reactions[idx] === "up" 
                        ? COLORS.accent.success 
                        : 'transparent',
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ 
                      fontSize: 20, 
                      opacity: reactions[idx] === "up" ? 1 : 0.4 
                    }}>
                      👍
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleReaction(idx, "down")}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: reactions[idx] === "down" 
                        ? `${COLORS.accent.error}33` 
                        : COLORS.background.tertiary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderColor: reactions[idx] === "down" 
                        ? COLORS.accent.error 
                        : 'transparent',
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ 
                      fontSize: 20, 
                      opacity: reactions[idx] === "down" ? 1 : 0.4 
                    }}>
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
