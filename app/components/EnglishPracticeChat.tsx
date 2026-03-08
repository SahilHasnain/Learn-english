import { fixEnglishMistakes } from "@/services/groqService";
import { COLORS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ActivityIndicator,
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
    <View style={{
      backgroundColor: COLORS.background.tertiary,
      borderRadius: 16,
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: COLORS.border.secondary,
    }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
      }}>
        <View style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: `${COLORS.accent.primary}33`,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Ionicons name="create" size={16} color={COLORS.accent.primary} />
        </View>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: COLORS.accent.primary,
        }}>
          Practice Your English
        </Text>
      </View>
      
      <Text style={{
        fontSize: 14,
        color: COLORS.text.secondary,
        marginBottom: SPACING.md,
      }}>
        Type what you want to say, and I'll help make it sound natural
      </Text>
      
      {/* Text Input */}
      <TextInput
        style={{
          backgroundColor: COLORS.background.secondary,
          borderRadius: 12,
          padding: SPACING.md,
          fontSize: 15,
          color: COLORS.text.primary,
          minHeight: 80,
          textAlignVertical: 'top',
          borderWidth: 1,
          borderColor: COLORS.border.primary,
          marginBottom: 12,
        }}
        placeholder="e.g., I want go to store buy milk..."
        placeholderTextColor={COLORS.text.disabled}
        value={userInput}
        onChangeText={setUserInput}
        multiline
      />
      
      {/* Fix Button */}
      <TouchableOpacity
        onPress={handleFixMistakes}
        disabled={!userInput.trim() || isFixing}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: !userInput.trim() || isFixing ? COLORS.interactive.disabled : COLORS.accent.primary,
          paddingVertical: 14,
          borderRadius: 12,
          gap: 8,
        }}
        activeOpacity={0.8}
      >
        {isFixing ? (
          <ActivityIndicator size="small" color={COLORS.text.primary} />
        ) : (
          <>
            <Ionicons name="sparkles" size={18} color={COLORS.text.primary} />
            <Text style={{
              color: COLORS.text.primary,
              fontSize: 15,
              fontWeight: '600',
            }}>
              Fix My English
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Fix Results */}
      {mistakeFix && (
        <View style={{ marginTop: SPACING.md, gap: 12 }}>
          {/* Corrected Version */}
          <View style={{
            backgroundColor: `${COLORS.accent.success}1A`,
            borderRadius: 12,
            padding: SPACING.md,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.accent.success,
          }}>
            <Text style={{
              fontSize: 13,
              fontWeight: '600',
              color: COLORS.accent.success,
              marginBottom: 8,
            }}>
              ✨ Better way to say it:
            </Text>
            <Text style={{
              fontSize: 16,
              color: COLORS.text.primary,
              lineHeight: 24,
            }}>
              {mistakeFix.corrected}
            </Text>
          </View>
          
          {/* Explanation */}
          <View style={{
            backgroundColor: `${COLORS.accent.info}1A`,
            borderRadius: 12,
            padding: SPACING.md,
            borderLeftWidth: 4,
            borderLeftColor: COLORS.accent.info,
          }}>
            <Text style={{
              fontSize: 13,
              fontWeight: '600',
              color: COLORS.accent.info,
              marginBottom: 8,
            }}>
              💡 Why:
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.text.secondary,
              lineHeight: 20,
            }}>
              {mistakeFix.explanation}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
