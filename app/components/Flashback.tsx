import { generateFlashback } from "@/services/groqService";
import { getAllLearnedWords } from "@/services/learningJourneyService";
import { COLORS, SHADOWS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface FlashbackData {
  word: string;
  hindiMeaning: string;
  sentence: string;
}

export default function Flashback() {
  const [flashback, setFlashback] = useState<FlashbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      loadFlashback();
    }
  }, []);

  const loadFlashback = async () => {
    setLoading(true);
    setError(false);
    try {
      const words = await getAllLearnedWords();
      if (words.length === 0) {
        setLoading(false);
        return;
      }

      // Pick a random word
      const randomWord = words[Math.floor(Math.random() * words.length)];
      const sentence = await generateFlashback(
        randomWord.word,
        randomWord.hindiMeaning,
      );

      setFlashback({
        word: randomWord.word,
        hindiMeaning: randomWord.hindiMeaning,
        sentence,
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything if no words learned yet
  if (!loading && !flashback && !error) return null;

  // Don't show error state — just hide silently
  if (error) return null;

  const renderSentence = (text: string, word: string) => {
    const regex = new RegExp(`(${word})`, "gi");
    const parts = text.split(regex);
    return (
      <Text
        style={{
          fontSize: 15,
          lineHeight: 24,
          color: COLORS.text.secondary,
          fontStyle: "italic",
        }}
      >
        {`"`}
        {parts.map((part, i) =>
          part.toLowerCase() === word.toLowerCase() ? (
            <Text
              key={i}
              style={{ color: COLORS.accent.warning, fontWeight: "700" }}
            >
              {part}
            </Text>
          ) : (
            part
          ),
        )}
        {`"`}
      </Text>
    );
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.background.tertiary,
        borderRadius: 16,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border.secondary,
        marginBottom: SPACING.xl,
        width: "100%",
        ...SHADOWS.sm,
      }}
    >
      {loading ? (
        <View style={{ alignItems: "center", paddingVertical: SPACING.md }}>
          <ActivityIndicator size="small" color={COLORS.accent.warning} />
          <Text
            style={{
              fontSize: 12,
              color: COLORS.text.tertiary,
              marginTop: SPACING.sm,
            }}
          >
            Finding a word to revisit...
          </Text>
        </View>
      ) : flashback ? (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
              gap: 8,
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: `${COLORS.accent.warning}33`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="refresh-circle"
                size={16}
                color={COLORS.accent.warning}
              />
            </View>
            <Text
              style={{
                fontSize: 13,
                color: COLORS.text.tertiary,
                fontWeight: "500",
              }}
            >
              Remember this word?
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              marginBottom: 8,
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: COLORS.text.primary,
              }}
            >
              {flashback.word}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.text.tertiary,
                fontStyle: "italic",
              }}
            >
              {flashback.hindiMeaning}
            </Text>
          </View>

          {renderSentence(flashback.sentence, flashback.word)}

          <TouchableOpacity
            onPress={loadFlashback}
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-end",
              marginTop: 12,
              gap: 4,
            }}
            activeOpacity={0.6}
          >
            <Ionicons name="shuffle" size={14} color={COLORS.accent.primary} />
            <Text
              style={{
                fontSize: 12,
                color: COLORS.accent.primary,
                fontWeight: "600",
              }}
            >
              Another word
            </Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
}
