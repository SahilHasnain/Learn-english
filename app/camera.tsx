import { analyzeImageWithGroq } from "@/services/groqService";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
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
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color="#9CA3AF" />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          Point your camera at objects to learn new English words
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
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

      const results = await analyzeImageWithGroq(photo.base64);

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
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} />
      <View style={styles.bottomSection}>
        <View style={styles.captureContainer}>
          <TouchableOpacity
            onPress={handleCapture}
            disabled={isAnalyzing}
            style={styles.captureButton}
          >
            {isAnalyzing ? (
              <ActivityIndicator size="large" color="#3B82F6" />
            ) : (
              <Ionicons name="camera" size={32} color="#3B82F6" />
            )}
          </TouchableOpacity>
          <Text style={styles.captureText}>
            {isAnalyzing ? "Analyzing..." : "Tap to capture"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingHorizontal: 24,
  },
  permissionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  permissionText: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  permissionButtonText: {
    color: "white",
    fontWeight: "600",
  },
  header: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#D1D5DB",
    marginTop: 4,
  },
  bottomSection: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
  },
  captureContainer: {
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#3B82F6",
  },
  captureText: {
    color: "white",
    fontSize: 14,
    marginTop: 8,
  },
});
