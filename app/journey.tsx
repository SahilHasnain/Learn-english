import {
  getAllLearnedWords,
  getLearningInsights,
  getTodayStats,
} from "@/services/learningJourneyService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
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

interface LearnedWord {
  word: string;
  hindiMeaning: string;
  level: string;
  timestamp: number;
  context?: string;
}

export default function JourneyScreen() {
  const router = useRouter();
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [stats, setStats] = useState({
    wordsToday: 0,
    totalWords: 0,
    streak: 0,
  });
  const [recentWords, setRecentWords] = useState<LearnedWord[]>([]);

  useEffect(() => {
    loadJourneyData();
  }, []);

  const loadJourneyData = async () => {
    const [insightsData, statsData, allWords] = await Promise.all([
      getLearningInsights(),
      getTodayStats(),
      getAllLearnedWords(),
    ]);

    setInsights(insightsData);
    setStats(statsData);
    setRecentWords(allWords.slice(-10).reverse());
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "milestone":
        return "#10B981";
      case "pattern":
        return "#3B82F6";
      case "suggestion":
        return "#8B5CF6";
      default:
        return "#6B7280";
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
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learning Journey</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={32} color="#3B82F6" />
            <Text style={styles.statNumber}>{stats.wordsToday}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="book-outline" size={32} color="#10B981" />
            <Text style={styles.statNumber}>{stats.totalWords}</Text>
            <Text style={styles.statLabel}>Total Words</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame-outline" size={32} color="#F59E0B" />
            <Text style={styles.statNumber}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {insights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Learning Story</Text>
            {insights.map((insight, index) => (
              <View
                key={index}
                style={[
                  styles.insightCard,
                  { borderLeftColor: getInsightColor(insight.type) },
                ]}
              >
                <View style={styles.insightHeader}>
                  <View
                    style={[
                      styles.insightIconContainer,
                      { backgroundColor: `${getInsightColor(insight.type)}20` },
                    ]}
                  >
                    <Ionicons
                      name={getInsightIcon(insight.icon)}
                      size={24}
                      color={getInsightColor(insight.type)}
                    />
                  </View>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                </View>
                <Text style={styles.insightMessage}>{insight.message}</Text>
              </View>
            ))}
          </View>
        )}

        {recentWords.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Learned</Text>
            {recentWords.map((word, index) => (
              <View key={index} style={styles.wordCard}>
                <View style={styles.wordInfo}>
                  <Text style={styles.wordText}>{word.word}</Text>
                  <Text style={styles.wordHindi}>{word.hindiMeaning}</Text>
                </View>
                <View style={styles.wordMeta}>
                  <View
                    style={[
                      styles.levelBadge,
                      {
                        backgroundColor:
                          word.level === "beginner"
                            ? "#10B981"
                            : word.level === "intermediate"
                              ? "#F59E0B"
                              : "#EF4444",
                      },
                    ]}
                  >
                    <Text style={styles.levelText}>{word.level}</Text>
                  </View>
                  {word.context && (
                    <Text style={styles.contextText}>{word.context}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {stats.totalWords === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="telescope-outline" size={80} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Start Your Journey</Text>
            <Text style={styles.emptyMessage}>
              Scan objects around you to begin building your vocabulary story!
            </Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
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
    padding: 16,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  insightCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  insightIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  insightTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  insightMessage: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
  },
  wordCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  wordInfo: {
    flex: 1,
  },
  wordText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  wordHindi: {
    fontSize: 14,
    color: "#6B7280",
    fontStyle: "italic",
    marginTop: 2,
  },
  wordMeta: {
    alignItems: "flex-end",
    gap: 6,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  contextText: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 40,
  },
  bottomPadding: {
    height: 40,
  },
});
