import { fixEnglishMistakes } from "@/services/groqService";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface MistakeFix {
  original: string;
  corrected: string;
  explanation: string;
}

export default function EnglishPracticeChat() {
  const [userInput, setUserInput] = useState("");
  const [mistakeFix, setMistakeFix] = useState<MistakeFix | null>(null);
  const [isFixing, setIsFixing] = useState(false);

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="create" size={20} color="#8B5CF6" />
        <Text style={styles.title}>Practice Your English</Text>
      </View>
      <Text style={styles.subtitle}>
        Type what you want to say, and I&apos;ll help make it sound natural
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
            <Text style={styles.fixResultLabel}>✨ Better way to say it:</Text>
            <Text style={styles.fixResultText}>{mistakeFix.corrected}</Text>
          </View>
          <View style={styles.explanationBox}>
            <Text style={styles.explanationLabel}>💡 Why:</Text>
            <Text style={styles.explanationText}>{mistakeFix.explanation}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  subtitle: {
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
});
