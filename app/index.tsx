import EnglishPracticeChat from "@/app/components/EnglishPracticeChat";
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
    <View style={{ flex: 1, backgroundColor: COLORS.background.primary }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background.primary} />
      
      {/* Hero Section */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        {/* App Icon with Gradient Background */}
        <View 
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            backgroundColor: COLORS.accent.primary,
            ...SHADOWS.accent,
          }}
        >
          <Ionicons name="book" size={48} color={COLORS.text.primary} />
        </View>

        {/* App Title */}
        <Text style={{ 
          fontSize: 40, 
          fontWeight: 'bold', 
          color: COLORS.text.primary,
          marginBottom: SPACING.sm 
        }}>
          ScanLearn
        </Text>
        <Text style={{ 
          fontSize: 16,
          color: COLORS.text.secondary, 
          textAlign: 'center', 
          marginBottom: SPACING.xl 
        }}>
          Learn vocabulary from the world around you
        </Text>

        {/* Stats Card */}
        {stats.totalWords > 0 && (
          <TouchableOpacity
            onPress={() => router.push("/journey")}
            style={{ 
              flexDirection: 'row',
              backgroundColor: COLORS.background.tertiary,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: COLORS.border.secondary,
              gap: SPACING.lg,
              marginBottom: SPACING.xl,
              ...SHADOWS.md,
            }}
            activeOpacity={0.7}
          >
            <View style={{ alignItems: 'center', gap: SPACING.xs }}>
              <View 
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${COLORS.accent.secondary}33` 
                }}
              >
                <Ionicons name="book-outline" size={20} color={COLORS.accent.secondary} />
              </View>
              <Text style={{ 
                fontSize: 20, 
                fontWeight: 'bold', 
                color: COLORS.text.primary 
              }}>
                {stats.totalWords}
              </Text>
              <Text style={{ 
                fontSize: 12, 
                color: COLORS.text.tertiary 
              }}>
                words
              </Text>
            </View>
            
            {stats.streak > 0 && (
              <>
                <View style={{ width: 1, backgroundColor: COLORS.border.primary }} />
                <View style={{ alignItems: 'center', gap: SPACING.xs }}>
                  <View 
                    style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `${COLORS.accent.warning}33` 
                    }}
                  >
                    <Ionicons name="flame" size={20} color={COLORS.accent.warning} />
                  </View>
                  <Text style={{ 
                    fontSize: 20, 
                    fontWeight: 'bold', 
                    color: COLORS.text.primary 
                  }}>
                    {stats.streak}
                  </Text>
                  <Text style={{ 
                    fontSize: 12, 
                    color: COLORS.text.tertiary 
                  }}>
                    day streak
                  </Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Action Buttons */}
        <View style={{ width: '100%', gap: SPACING.md }}>
          <Link href="/camera" asChild>
            <TouchableOpacity 
              style={{ 
                backgroundColor: COLORS.accent.primary,
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                ...SHADOWS.md,
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={24} color={COLORS.text.primary} />
              <Text style={{ 
                color: COLORS.text.primary, 
                fontWeight: '600', 
                fontSize: 18, 
                marginLeft: 12 
              }}>
                Start Learning
              </Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            onPress={() => setIsChatModalVisible(true)}
            style={{ 
              backgroundColor: COLORS.accent.secondary,
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              ...SHADOWS.md,
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubbles" size={24} color={COLORS.text.primary} />
            <Text style={{ 
              color: COLORS.text.primary, 
              fontWeight: '600', 
              fontSize: 18, 
              marginLeft: 12 
            }}>
              Practice English
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats Footer */}
        {stats.wordsToday > 0 && (
          <View 
            style={{ 
              marginTop: 32,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 999,
              backgroundColor: COLORS.background.tertiary 
            }}
          >
            <Text style={{ fontSize: 14 }}>
              <Text style={{ color: COLORS.accent.success, fontWeight: '600' }}>
                {stats.wordsToday}
              </Text>
              <Text style={{ color: COLORS.text.tertiary }}> words learned today</Text>
            </Text>
          </View>
        )}
      </View>

      {/* Chat Modal */}
      <Modal
        visible={isChatModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsChatModalVisible(false)}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: COLORS.overlay.dark,
          justifyContent: 'flex-end',
        }}>
          <View style={{ 
            backgroundColor: COLORS.background.secondary,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '85%',
            paddingTop: SPACING.lg,
          }}>
            {/* Modal Header */}
            <View style={{ 
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: SPACING.lg,
              paddingBottom: SPACING.md,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border.subtle,
            }}>
              <Text style={{ 
                fontSize: 20, 
                fontWeight: 'bold', 
                color: COLORS.text.primary 
              }}>
                English Practice
              </Text>
              <TouchableOpacity
                onPress={() => setIsChatModalVisible(false)}
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
                <Ionicons name="close" size={24} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>
            
            {/* Modal Content */}
            <ScrollView
              style={{ padding: SPACING.lg }}
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
