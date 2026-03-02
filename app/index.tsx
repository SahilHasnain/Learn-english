import EnglishPracticeChat from "@/app/components/EnglishPracticeChat";
import { getTodayStats } from "@/services/learningJourneyService";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const [stats, setStats] = useState({
    wordsToday: 0,
    totalWords: 0,
    streak: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getTodayStats();
    setStats(data);
  };

  return (
    <View className="flex-1 justify-center items-center bg-gradient-to-b from-blue-50 to-white px-6">
      <Ionicons name="book" size={80} color="#3B82F6" />
      <Text className="text-4xl font-bold text-gray-900 mt-6">ScanLearn</Text>
      <Text className="text-gray-600 text-center mt-3 mb-8">
        Learn vocabulary from the world around you
      </Text>

      {stats.totalWords > 0 && (
        <TouchableOpacity
          onPress={() => router.push("/journey")}
          style={styles.statsCard}
        >
          <View style={styles.statItem}>
            <Ionicons name="book-outline" size={20} color="#3B82F6" />
            <Text style={styles.statNumber}>{stats.totalWords}</Text>
            <Text style={styles.statLabel}>words</Text>
          </View>
          {stats.streak > 0 && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="flame" size={20} color="#F59E0B" />
                <Text style={styles.statNumber}>{stats.streak}</Text>
                <Text style={styles.statLabel}>day streak</Text>
              </View>
            </>
          )}
        </TouchableOpacity>
      )}

      <Link href="/camera" asChild>
        <TouchableOpacity className="bg-blue-600 px-8 py-4 rounded-full flex-row items-center mb-4">
          <Ionicons name="camera" size={24} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">
            Start Learning
          </Text>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity
        onPress={() => setIsChatModalVisible(true)}
        className="bg-purple-600 px-8 py-4 rounded-full flex-row items-center"
      >
        <Ionicons name="chatbubbles" size={24} color="white" />
        <Text className="text-white font-semibold text-lg ml-2">
          Practice English
        </Text>
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
              <Text style={styles.modalTitle}>English Practice</Text>
              <TouchableOpacity
                onPress={() => setIsChatModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color="#111827" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 16,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalScroll: {
    padding: 20,
  },
});
