import {
    type DayGroup,
    getLearningInsights,
    getSessionsByDay,
    getTodayStats,
} from "@/services/learningJourneyService";
import { COLORS, SHADOWS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LearningInsight {
  type: "pattern" | "milestone" | "suggestion";
  title: string;
  message: string;
  icon: string;
}

export default function JourneyScreen() {
  const router = useRouter();
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [stats, setStats] = useState({
    wordsToday: 0,
    totalWords: 0,
    streak: 0,
  });
  const [dayGroups, setDayGroups] = useState<DayGroup[]>([]);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    loadJourneyData();
  }, []);

  const loadJourneyData = async () => {
    const [insightsData, statsData, sessionGroups] = await Promise.all([
      getLearningInsights(),
      getTodayStats(),
      getSessionsByDay(),
    ]);

    setInsights(insightsData);
    setStats(statsData);
    setDayGroups(sessionGroups);

    // Auto-expand the first session of today
    if (sessionGroups.length > 0 && sessionGroups[0].sessions.length > 0) {
      setExpandedSessions(new Set([sessionGroups[0].sessions[0].id]));
    }
  };

  const toggleSession = useCallback((sessionId: string) => {
    setExpandedSessions((prev) => {
      const next = new Set(prev);
      if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
      }
      return next;
    });
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "milestone":
        return COLORS.accent.success;
      case "pattern":
        return COLORS.accent.secondary;
      case "suggestion":
        return COLORS.accent.primary;
      default:
        return COLORS.text.disabled;
    }
  };

  const getInsightIcon = (icon: string) => {
    const iconMap: Record<string, any> = {
      trophy: "trophy",
      analytics: "analytics",
      calendar: "calendar",
      flame: "flame",
      bulb: "bulb",
    };
    return iconMap[icon] || "information-circle";
  };

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: COLORS.background.primary }} 
      edges={["top", "bottom"]}
    >
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.background.secondary,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border.subtle,
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            backgroundColor: COLORS.background.tertiary,
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: COLORS.text.primary,
        }}>
          Learning Journey
        </Text>
        
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={{ flex: 1, padding: SPACING.md }} 
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Cards */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: SPACING.lg }}>
          <View style={{
            flex: 1,
            backgroundColor: COLORS.background.secondary,
            borderRadius: 16,
            padding: SPACING.lg,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: COLORS.border.subtle,
            ...SHADOWS.md,
          }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: `${COLORS.accent.secondary}33`,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="calendar-outline" size={24} color={COLORS.accent.secondary} />
            </View>
            <Text style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: COLORS.text.primary,
              marginTop: 8,
            }}>
              {stats.wordsToday}
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.text.tertiary,
              marginTop: 4,
            }}>
              Today
            </Text>
          </View>
          
          <View style={{
            flex: 1,
            backgroundColor: COLORS.background.secondary,
            borderRadius: 16,
            padding: SPACING.lg,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: COLORS.border.subtle,
            ...SHADOWS.md,
          }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: `${COLORS.accent.success}33`,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="book-outline" size={24} color={COLORS.accent.success} />
            </View>
            <Text style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: COLORS.text.primary,
              marginTop: 8,
            }}>
              {stats.totalWords}
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.text.tertiary,
              marginTop: 4,
            }}>
              Total Words
            </Text>
          </View>
          
          <View style={{
            flex: 1,
            backgroundColor: COLORS.background.secondary,
            borderRadius: 16,
            padding: SPACING.lg,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: COLORS.border.subtle,
            ...SHADOWS.md,
          }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: `${COLORS.accent.warning}33`,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="flame-outline" size={24} color={COLORS.accent.warning} />
            </View>
            <Text style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: COLORS.text.primary,
              marginTop: 8,
            }}>
              {stats.streak}
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.text.tertiary,
              marginTop: 4,
            }}>
              Day Streak
            </Text>
          </View>
        </View>

        {/* Learning Insights */}
        {insights.length > 0 && (
          <View style={{ marginBottom: SPACING.lg }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: COLORS.text.primary,
              marginBottom: SPACING.md,
            }}>
              Your Learning Story
            </Text>
            
            {insights.map((insight, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: COLORS.background.secondary,
                  borderRadius: 16,
                  padding: SPACING.lg,
                  marginBottom: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: getInsightColor(insight.type),
                  borderWidth: 1,
                  borderColor: COLORS.border.subtle,
                  ...SHADOWS.md,
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 12,
                }}>
                  <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: `${getInsightColor(insight.type)}33`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Ionicons
                      name={getInsightIcon(insight.icon)}
                      size={24}
                      color={getInsightColor(insight.type)}
                    />
                  </View>
                  <Text style={{
                    flex: 1,
                    fontSize: 16,
                    fontWeight: '700',
                    color: COLORS.text.primary,
                  }}>
                    {insight.title}
                  </Text>
                </View>
                <Text style={{
                  fontSize: 14,
                  color: COLORS.text.secondary,
                  lineHeight: 22,
                }}>
                  {insight.message}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Word Timeline */}
        {dayGroups.length > 0 && (
          <View style={{ marginBottom: SPACING.lg }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: COLORS.text.primary,
              marginBottom: SPACING.md,
            }}>
              Your Word Timeline
            </Text>
            
            {dayGroups.map((dayGroup) => (
              <View key={dayGroup.dateKey} style={{ marginBottom: 8 }}>
                {/* Day Header */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                  gap: 10,
                }}>
                  <View style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: COLORS.accent.primary,
                  }} />
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: COLORS.text.primary,
                    flex: 1,
                  }}>
                    {dayGroup.label}
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: COLORS.text.tertiary,
                    fontWeight: '500',
                  }}>
                    {dayGroup.sessions.reduce((sum, s) => sum + s.words.length, 0)} words
                  </Text>
                </View>

                {/* Sessions */}
                {dayGroup.sessions.map((session) => {
                  const isExpanded = expandedSessions.has(session.id);
                  return (
                    <View 
                      key={session.id} 
                      style={{
                        flexDirection: 'row',
                        marginLeft: 4,
                        marginBottom: 12,
                      }}
                    >
                      <View style={{
                        width: 2,
                        backgroundColor: `${COLORS.accent.primary}33`,
                        marginRight: 18,
                      }} />
                      
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          backgroundColor: COLORS.background.secondary,
                          borderRadius: 14,
                          padding: 14,
                          borderWidth: 1,
                          borderColor: COLORS.border.subtle,
                          ...SHADOWS.sm,
                        }}
                        onPress={() => toggleSession(session.id)}
                        activeOpacity={0.7}
                      >
                        {/* Session Header */}
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                          }}>
                            <View style={{
                              width: 34,
                              height: 34,
                              borderRadius: 17,
                              backgroundColor: `${COLORS.accent.primary}33`,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <Ionicons name="camera" size={16} color={COLORS.accent.primary} />
                            </View>
                            <View>
                              <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: COLORS.text.primary,
                              }}>
                                {formatTime(session.timestamp)}
                              </Text>
                              <Text style={{
                                fontSize: 12,
                                color: COLORS.text.tertiary,
                                marginTop: 1,
                              }}>
                                {session.words.length} {session.words.length === 1 ? "word" : "words"} learned
                              </Text>
                            </View>
                          </View>
                          <Ionicons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            color={COLORS.text.tertiary}
                          />
                        </View>

                        {/* Session Words */}
                        {isExpanded && (
                          <View style={{
                            marginTop: 12,
                            borderTopWidth: 1,
                            borderTopColor: COLORS.border.subtle,
                            paddingTop: 12,
                            gap: 8,
                          }}>
                            {session.words.map((word, wIdx) => (
                              <View 
                                key={wIdx} 
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  backgroundColor: COLORS.background.tertiary,
                                  borderRadius: 10,
                                  paddingVertical: 10,
                                  paddingHorizontal: 14,
                                  borderWidth: 1,
                                  borderColor: COLORS.border.secondary,
                                }}
                              >
                                <View style={{ flex: 1 }}>
                                  <Text style={{
                                    fontSize: 16,
                                    fontWeight: '700',
                                    color: COLORS.text.primary,
                                  }}>
                                    {word.word}
                                  </Text>
                                  <Text style={{
                                    fontSize: 13,
                                    color: COLORS.text.tertiary,
                                    fontStyle: 'italic',
                                    marginTop: 1,
                                  }}>
                                    {word.hindiMeaning}
                                  </Text>
                                </View>
                                <View style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: 5,
                                  marginLeft: 10,
                                  backgroundColor: word.level === "beginner"
                                    ? COLORS.accent.success
                                    : word.level === "intermediate"
                                    ? COLORS.accent.warning
                                    : COLORS.accent.error,
                                }} />
                              </View>
                            ))}
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {stats.totalWords === 0 && (
          <View style={{
            alignItems: 'center',
            paddingVertical: 60,
          }}>
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: COLORS.background.tertiary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: SPACING.lg,
            }}>
              <Ionicons name="telescope-outline" size={60} color={COLORS.text.disabled} />
            </View>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: COLORS.text.primary,
              marginBottom: 8,
            }}>
              Start Your Journey
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.text.secondary,
              textAlign: 'center',
              paddingHorizontal: 40,
              lineHeight: 22,
            }}>
              Scan objects around you to begin building your vocabulary story!
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
