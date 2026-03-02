import { getRelatedWords } from "@/services/groqService";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface RelatedWord {
  word: string;
  relation: string;
  example: string;
}

interface RelatedWordsCluster {
  category: string;
  words: RelatedWord[];
}

interface RelatedWordsSectionProps {
  words: string[];
}

export default function RelatedWordsSection({
  words,
}: RelatedWordsSectionProps) {
  const [clusters, setClusters] = useState<RelatedWordsCluster[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const loadRelatedWords = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getRelatedWords(words);
      setClusters(result);
    } catch (error) {
      console.error("Error loading related words:", error);
    } finally {
      setLoading(false);
    }
  }, [words]);

  useEffect(() => {
    if (words.length > 0) {
      loadRelatedWords();
    }
  }, [words.length, loadRelatedWords]);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsExpanded(!isExpanded)}
        disabled={loading}
      >
        <View style={styles.buttonContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="git-network" size={20} color="#8B5CF6" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.buttonTitle}>Related Words Network</Text>
            <Text style={styles.buttonSubtitle}>Build deeper connections</Text>
          </View>
        </View>
        {loading ? (
          <ActivityIndicator size="small" color="#8B5CF6" />
        ) : (
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#8B5CF6"
          />
        )}
      </TouchableOpacity>

      {isExpanded && clusters.length > 0 && (
        <View style={styles.container}>
          {clusters.map((cluster, clusterIdx) => (
            <View key={clusterIdx} style={styles.clusterCard}>
              <View style={styles.clusterHeader}>
                <Ionicons name="layers" size={18} color="#8B5CF6" />
                <Text style={styles.clusterTitle}>{cluster.category}</Text>
              </View>
              <View style={styles.clusterWordsContainer}>
                {cluster.words.map((relatedWord, wordIdx) => (
                  <View key={wordIdx} style={styles.relatedWordItem}>
                    <View style={styles.relatedWordHeader}>
                      <Text style={styles.relatedWordText}>
                        {relatedWord.word}
                      </Text>
                      <View style={styles.relationBadge}>
                        <Text style={styles.relationText}>
                          {relatedWord.relation}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.relatedWordExample}>
                      {relatedWord.example}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAF5FF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#E9D5FF",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7C3AED",
    marginBottom: 2,
  },
  buttonSubtitle: {
    fontSize: 13,
    color: "#9333EA",
  },
  container: {
    marginBottom: 20,
    gap: 16,
  },
  clusterCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#8B5CF6",
  },
  clusterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  clusterTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#7C3AED",
  },
  clusterWordsContainer: {
    gap: 14,
  },
  relatedWordItem: {
    backgroundColor: "#FAFAFA",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3E8FF",
  },
  relatedWordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    flexWrap: "wrap",
    gap: 8,
  },
  relatedWordText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  relationBadge: {
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  relationText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#7C3AED",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  relatedWordExample: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    fontStyle: "italic",
  },
});
