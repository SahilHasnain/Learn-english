import { analyzeImageWithGroq } from "@/services/groqService";
import { getEnglishLevel } from "@/services/storageService";
import { COLORS, SHADOWS, SPACING } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background.primary }} />
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background.primary,
          paddingHorizontal: 24,
        }}
      >
        {/* Permission Icon */}
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: COLORS.background.tertiary,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: SPACING.xl,
            ...SHADOWS.lg,
          }}
        >
          <Ionicons
            name="camera-outline"
            size={64}
            color={COLORS.text.tertiary}
          />
        </View>

        {/* Permission Text */}
        <Text
          style={{
            color: COLORS.text.primary,
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: SPACING.sm,
            textAlign: "center",
          }}
        >
          Camera Access Required
        </Text>
        <Text
          style={{
            color: COLORS.text.secondary,
            fontSize: 16,
            textAlign: "center",
            marginBottom: SPACING.xl,
            lineHeight: 24,
          }}
        >
          Point your camera at objects to learn new English words
        </Text>

        {/* Grant Permission Button */}
        <TouchableOpacity
          onPress={requestPermission}
          style={{
            backgroundColor: COLORS.accent.primary,
            paddingHorizontal: 32,
            paddingVertical: 16,
            borderRadius: 16,
            ...SHADOWS.md,
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: COLORS.text.primary,
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            Grant Permission
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isAnalyzing) return;

    setIsAnalyzing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });

      if (!photo.base64) {
        throw new Error("Failed to capture image");
      }

      const level = await getEnglishLevel();
      const results = await analyzeImageWithGroq(
        photo.base64,
        level || "intermediate",
      );

      // Navigate to results screen
      router.push({
        pathname: "/results",
        params: { suggestions: JSON.stringify(results) },
      });
    } catch (error) {
      console.error("Error analyzing photo:", error);
      Alert.alert(
        "Analysis Failed",
        "Could not analyze the image. Please check your API key and try again.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background.primary }}>
      <CameraView
        ref={cameraRef}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Header Overlay */}
      <SafeAreaView style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
        <View
          style={{
            paddingHorizontal: SPACING.lg,
            paddingVertical: SPACING.md,
            backgroundColor: COLORS.overlay.medium,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: COLORS.background.tertiary,
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Bottom Section */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 40,
          paddingTop: SPACING.xl,
          backgroundColor: COLORS.overlay.medium,
        }}
      >
        <View style={{ alignItems: "center" }}>
          {/* Capture Button */}
          <TouchableOpacity
            onPress={handleCapture}
            disabled={isAnalyzing}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: COLORS.text.primary,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 4,
              borderColor: COLORS.accent.primary,
              ...SHADOWS.lg,
            }}
            activeOpacity={0.8}
          >
            {isAnalyzing ? (
              <ActivityIndicator size="large" color={COLORS.accent.primary} />
            ) : (
              <Ionicons name="camera" size={36} color={COLORS.accent.primary} />
            )}
          </TouchableOpacity>

          {/* Capture Text */}
          <Text
            style={{
              color: COLORS.text.primary,
              fontSize: 16,
              fontWeight: "600",
              marginTop: SPACING.md,
            }}
          >
            {isAnalyzing ? "Analyzing..." : "Tap to capture"}
          </Text>

          {/* Instruction Text */}
          {!isAnalyzing && (
            <Text
              style={{
                color: COLORS.text.secondary,
                fontSize: 14,
                marginTop: SPACING.xs,
                textAlign: "center",
                paddingHorizontal: SPACING.xl,
              }}
            >
              Point at objects to learn their English names
            </Text>
          )}
        </View>
      </View>

      {/* Corner Frame Indicators */}
      <View
        style={{
          position: "absolute",
          top: 100,
          left: 40,
          width: 40,
          height: 40,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 40,
            height: 3,
            backgroundColor: COLORS.accent.primary,
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: 40,
            backgroundColor: COLORS.accent.primary,
          }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          top: 100,
          right: 40,
          width: 40,
          height: 40,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 40,
            height: 3,
            backgroundColor: COLORS.accent.primary,
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 3,
            height: 40,
            backgroundColor: COLORS.accent.primary,
          }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 180,
          left: 40,
          width: 40,
          height: 40,
        }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 40,
            height: 3,
            backgroundColor: COLORS.accent.primary,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 3,
            height: 40,
            backgroundColor: COLORS.accent.primary,
          }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 180,
          right: 40,
          width: 40,
          height: 40,
        }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 40,
            height: 3,
            backgroundColor: COLORS.accent.primary,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 3,
            height: 40,
            backgroundColor: COLORS.accent.primary,
          }}
        />
      </View>
    </View>
  );
}
