import { getRelatedWords } from "@/services/groqService";
import { getLearningLanguage } from "@/services/storageService";
import { COLORS, SHADOWS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface RelatedWord {
  word: string;
  relation: string;
  example: string;
  hindiMeaning: string;
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
      const language = await getLearningLanguage();
      const result = await getRelatedWords(words, language || "hindi");
      setClusters(result);
    } catch (error) {
      console.error("Error loading related words:", error);
      setClusters([]);
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
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: `${COLORS.accent.primary}1A`,
          padding: SPACING.md,
          borderRadius: 16,
          marginBottom: SPACING.lg,
          borderWidth: 2,
          borderColor: `${COLORS.accent.primary}33`,
        }}
        onPress={() => setIsExpanded(!isExpanded)}
        disabled={loading}
        activeOpacity={0.7}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            flex: 1,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: `${COLORS.accent.primary}33`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="git-network"
              size={20}
              color={COLORS.accent.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: COLORS.accent.primary,
                marginBottom: 2,
              }}
            >
              Related Words Network
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: COLORS.text.secondary,
              }}
            >
              Build deeper connections
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={COLORS.accent.primary} />
        ) : (
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={COLORS.accent.primary}
          />
        )}
      </TouchableOpacity>

      {isExpanded && clusters.length > 0 && (
        <View style={{ marginBottom: SPACING.lg, gap: SPACING.md }}>
          {clusters.map((cluster, clusterIdx) => (
            <View
              key={clusterIdx}
              style={{
                backgroundColor: COLORS.background.secondary,
                borderRadius: 16,
                padding: SPACING.lg,
                borderLeftWidth: 4,
                borderLeftColor: COLORS.accent.primary,
                borderWidth: 1,
                borderColor: COLORS.border.subtle,
                ...SHADOWS.md,
              }}
            >
              {/* Cluster Header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: SPACING.md,
                  paddingBottom: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.border.subtle,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: `${COLORS.accent.primary}33`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="layers"
                    size={16}
                    color={COLORS.accent.primary}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    color: COLORS.accent.primary,
                  }}
                >
                  {cluster.category}
                </Text>
              </View>

              {/* Cluster Words */}
              <View style={{ gap: 14 }}>
                {cluster.words.map((relatedWord, wordIdx) => (
                  <View
                    key={wordIdx}
                    style={{
                      backgroundColor: COLORS.background.tertiary,
                      padding: 14,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: COLORS.border.secondary,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      <View style={{ gap: 2 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "700",
                            color: COLORS.text.primary,
                          }}
                        >
                          {relatedWord.word}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: COLORS.text.tertiary,
                            fontStyle: "italic",
                          }}
                        >
                          {relatedWord.hindiMeaning}
                        </Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: `${COLORS.accent.primary}33`,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: "600",
                            color: COLORS.accent.primary,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {relatedWord.relation}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.text.secondary,
                        lineHeight: 20,
                        fontStyle: "italic",
                      }}
                    >
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
