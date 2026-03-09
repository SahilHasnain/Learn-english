import type { DictMode } from "@/app/hooks/useDictionary";
import { DictionaryEntry } from "@/services/groqService";
import { COLORS, SHADOWS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import KeyboardSpacer from "./KeyboardSpacer";

interface DictionarySheetProps {
  visible: boolean;
  mode: DictMode;
  query: string;
  onQueryChange: (text: string) => void;
  result: DictionaryEntry | null;
  loading: boolean;
  error: string | null;
  onSearch: (word: string) => void;
  onClose: () => void;
  onToggleMode: () => void;
}

const LEVEL_COLORS: Record<string, string> = {
  beginner: COLORS.accent.success,
  intermediate: COLORS.accent.warning,
  advanced: COLORS.accent.error,
};

export function DictionarySheet({
  visible,
  mode,
  query,
  onQueryChange,
  result,
  loading,
  error,
  onSearch,
  onClose,
  onToggleMode,
}: DictionarySheetProps) {
  const inputRef = useRef<TextInput>(null);

  const handleSearch = () => {
    Keyboard.dismiss();
    onSearch(query);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.background.secondary,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            maxHeight: "60%",
            paddingTop: 8,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: SPACING.lg,
              paddingVertical: SPACING.lg,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border.subtle,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: `${COLORS.accent.info}33`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="book" size={20} color={COLORS.accent.info} />
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: COLORS.text.primary,
                }}
              >
                Dictionary
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <TouchableOpacity
                onPress={onToggleMode}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: COLORS.background.tertiary,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: COLORS.border.primary,
                  gap: 6,
                }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 12, fontWeight: "600", color: mode === "en" ? COLORS.accent.info : COLORS.text.tertiary }}>
                  EN
                </Text>
                <Ionicons name="swap-horizontal" size={14} color={COLORS.text.tertiary} />
                <Text style={{ fontSize: 12, fontWeight: "600", color: mode === "reverse" ? COLORS.accent.info : COLORS.text.tertiary }}>
                  L1
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  backgroundColor: COLORS.background.tertiary,
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            style={{ padding: SPACING.lg, paddingBottom: SPACING.xxl }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Search Bar */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.background.tertiary,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: COLORS.border.primary,
                paddingHorizontal: 14,
                gap: 10,
                marginBottom: SPACING.lg,
              }}
            >
              <Ionicons name="search" size={20} color={COLORS.text.tertiary} />
              <TextInput
                ref={inputRef}
                placeholder={mode === "en" ? "Type an English word..." : "Type in your language..."}
                placeholderTextColor={COLORS.text.disabled}
                value={query}
                onChangeText={onQueryChange}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: COLORS.text.primary,
                  paddingVertical: 14,
                }}
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={handleSearch} activeOpacity={0.7}>
                  <View
                    style={{
                      backgroundColor: COLORS.accent.primary,
                      borderRadius: 10,
                      padding: 8,
                    }}
                  >
                    <Ionicons name="arrow-forward" size={16} color={COLORS.text.primary} />
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Loading */}
            {loading && (
              <View style={{ alignItems: "center", paddingVertical: SPACING.xl }}>
                <ActivityIndicator size="large" color={COLORS.accent.primary} />
                <Text style={{ color: COLORS.text.tertiary, marginTop: SPACING.sm, fontSize: 14 }}>
                  Looking up...
                </Text>
              </View>
            )}

            {/* Error */}
            {error && (
              <View
                style={{
                  padding: SPACING.md,
                  backgroundColor: `${COLORS.accent.error}15`,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: COLORS.accent.error, fontSize: 14 }}>{error}</Text>
              </View>
            )}

            {/* Result */}
            {result && <DictionaryResult entry={result} />}

            {/* Empty state */}
            {!loading && !error && !result && (
              <View style={{ alignItems: "center", paddingVertical: SPACING.lg }}>
                <Ionicons name="book-outline" size={44} color={COLORS.text.disabled} />
                <Text
                  style={{
                    color: COLORS.text.tertiary,
                    fontSize: 15,
                    marginTop: SPACING.sm,
                    textAlign: "center",
                  }}
                >
                  {mode === "en"
                ? "Search any English word"
                : "Type a word in your language"}
                </Text>
              </View>
            )}

            <KeyboardSpacer />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function DictionaryResult({ entry }: { entry: DictionaryEntry }) {
  const levelColor = LEVEL_COLORS[entry.level] ?? COLORS.text.disabled;

  return (
    <View style={{ gap: SPACING.md }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 28, fontWeight: "bold", color: COLORS.text.primary }}>
            {entry.word}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
            <Text style={{ fontSize: 13, color: COLORS.accent.primary, fontStyle: "italic" }}>
              {entry.partOfSpeech}
            </Text>
            {entry.pronunciation && (
              <Text style={{ fontSize: 12, color: COLORS.text.tertiary }}>
                🔊 {entry.pronunciation}
              </Text>
            )}
          </View>
        </View>
        <View
          style={{
            backgroundColor: levelColor,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 10,
            ...SHADOWS.sm,
          }}
        >
          <Text
            style={{
              color: COLORS.text.primary,
              fontSize: 11,
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {entry.level}
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: COLORS.background.tertiary,
          padding: SPACING.md,
          borderRadius: 14,
          borderLeftWidth: 3,
          borderLeftColor: COLORS.accent.primary,
        }}
      >
        <Text style={{ fontSize: 16, color: COLORS.text.secondary, lineHeight: 24 }}>
          {entry.meaning}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: COLORS.background.tertiary,
          padding: SPACING.md,
          borderRadius: 14,
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <Ionicons
          name="chatbox-ellipses-outline"
          size={16}
          color={COLORS.text.tertiary}
          style={{ marginTop: 3 }}
        />
        <Text style={{ fontSize: 15, color: COLORS.text.secondary, lineHeight: 24, flex: 1 }}>
          {entry.exampleSentence}
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: SPACING.sm }}>
        {entry.synonyms.length > 0 && (
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: COLORS.text.tertiary, marginBottom: 6, fontWeight: "600" }}>
              SYNONYMS
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {entry.synonyms.map((s) => (
                <View
                  key={s}
                  style={{
                    backgroundColor: `${COLORS.accent.success}20`,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontSize: 13, color: COLORS.accent.success }}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {entry.antonyms.length > 0 && (
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: COLORS.text.tertiary, marginBottom: 6, fontWeight: "600" }}>
              ANTONYMS
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {entry.antonyms.map((a) => (
                <View
                  key={a}
                  style={{
                    backgroundColor: `${COLORS.accent.error}20`,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontSize: 13, color: COLORS.accent.error }}>{a}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
