import EnglishPracticeChat from "@/app/components/EnglishPracticeChat";
import RelatedWordsSection from "@/app/components/RelatedWordsSection";
import WordCard from "@/app/components/WordCard";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
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

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);

  const suggestions: WordSuggestion[] = useMemo(
    () => (params.suggestions ? JSON.parse(params.suggestions as string) : []),
    [params.suggestions],
  );

  const words = useMemo(() => suggestions.map((s) => s.word), [suggestions]);

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

        <RelatedWordsSection words={words} />

        {suggestions.map((item, index) => (
          <WordCard
            key={index}
            word={item.word}
            level={item.level}
            sentence={item.sentence}
            conversationStarters={item.conversationStarters}
          />
        ))}

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
