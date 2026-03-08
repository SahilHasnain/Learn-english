import EnglishPracticeChat from "@/app/components/EnglishPracticeChat";
import Flashback from "@/app/components/Flashback";
import KeyboardSpacer from "@/app/components/KeyboardSpacer";
import { getTodayStats } from "@/services/learningJourneyService";
import { COLORS, SHADOWS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.background.primary }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background.primary}
      />

      {/* Compact Header - Icon and Brand Inline */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 24,
          paddingTop: SPACING.lg,
          paddingBottom: SPACING.md,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.accent.primary,
            ...SHADOWS.md,
          }}
        >
          <Ionicons name="book" size={24} color={COLORS.text.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: COLORS.text.primary,
            }}
          >
            ScanLearn
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: COLORS.text.tertiary,
            }}
          >
            Learn from the world around you
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: SPACING.lg,
          flexGrow: 1,
          justifyContent: "flex-end",
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* Stats Card */}
        {stats.totalWords > 0 && (
          <TouchableOpacity
            onPress={() => router.push("/journey")}
            style={{
              flexDirection: "row",
              backgroundColor: COLORS.background.tertiary,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: COLORS.border.secondary,
              gap: SPACING.md,
              marginBottom: SPACING.md,
              ...SHADOWS.md,
            }}
            activeOpacity={0.7}
          >
            <View style={{ alignItems: "center", gap: 4, flex: 1 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: `${COLORS.accent.secondary}33`,
                }}
              >
                <Ionicons
                  name="book-outline"
                  size={18}
                  color={COLORS.accent.secondary}
                />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: COLORS.text.primary,
                }}
              >
                {stats.totalWords}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: COLORS.text.tertiary,
                }}
              >
                words
              </Text>
            </View>

            {stats.streak > 0 && (
              <>
                <View
                  style={{ width: 1, backgroundColor: COLORS.border.primary }}
                />
                <View style={{ alignItems: "center", gap: 4, flex: 1 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: `${COLORS.accent.warning}33`,
                    }}
                  >
                    <Ionicons
                      name="flame"
                      size={18}
                      color={COLORS.accent.warning}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: COLORS.text.primary,
                    }}
                  >
                    {stats.streak}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: COLORS.text.tertiary,
                    }}
                  >
                    day streak
                  </Text>
                </View>
              </>
            )}

            {stats.wordsToday > 0 && (
              <>
                <View
                  style={{ width: 1, backgroundColor: COLORS.border.primary }}
                />
                <View style={{ alignItems: "center", gap: 4, flex: 1 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: `${COLORS.accent.success}33`,
                    }}
                  >
                    <Ionicons
                      name="calendar"
                      size={18}
                      color={COLORS.accent.success}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: COLORS.text.primary,
                    }}
                  >
                    {stats.wordsToday}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: COLORS.text.tertiary,
                    }}
                  >
                    today
                  </Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Flashback - passive recall */}
        {stats.totalWords > 0 && <Flashback />}

        {/* Action Buttons */}
        <View style={{ gap: SPACING.md, marginTop: SPACING.md }}>
          <Link href="/camera" asChild>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.accent.primary,
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                ...SHADOWS.md,
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={24} color={COLORS.text.primary} />
              <Text
                style={{
                  color: COLORS.text.primary,
                  fontWeight: "600",
                  fontSize: 18,
                  marginLeft: 12,
                }}
              >
                Start Learning
              </Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            onPress={() => router.push("/journey")}
            style={{
              backgroundColor: COLORS.background.tertiary,
              borderRadius: 16,
              padding: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: COLORS.border.primary,
              ...SHADOWS.sm,
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="map-outline"
              size={24}
              color={COLORS.accent.primary}
            />
            <Text
              style={{
                color: COLORS.text.primary,
                fontWeight: "600",
                fontSize: 18,
                marginLeft: 12,
              }}
            >
              Learning Journey
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsChatModalVisible(true)}
            style={{
              backgroundColor: COLORS.accent.secondary,
              borderRadius: 16,
              padding: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              ...SHADOWS.md,
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="chatbubbles"
              size={24}
              color={COLORS.text.primary}
            />
            <Text
              style={{
                color: COLORS.text.primary,
                fontWeight: "600",
                fontSize: 18,
                marginLeft: 12,
              }}
            >
              Practice English
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: SPACING.xl }} />
      </ScrollView>

      {/* Chat Modal */}
      <Modal
        visible={isChatModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsChatModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.overlay.dark,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.background.secondary,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: "85%",
              paddingTop: SPACING.lg,
            }}
          >
            {/* Modal Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: SPACING.lg,
                paddingBottom: SPACING.md,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.border.subtle,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: COLORS.text.primary,
                }}
              >
                English Practice
              </Text>
              <TouchableOpacity
                onPress={() => setIsChatModalVisible(false)}
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

            {/* Modal Content */}
            <ScrollView
              style={{ padding: SPACING.lg }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <EnglishPracticeChat />
              <KeyboardSpacer />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
