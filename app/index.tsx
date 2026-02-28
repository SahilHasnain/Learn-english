import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-gradient-to-b from-blue-50 to-white px-6">
      <Ionicons name="book" size={80} color="#3B82F6" />
      <Text className="text-4xl font-bold text-gray-900 mt-6">
        English Learning
      </Text>
      <Text className="text-gray-600 text-center mt-3 mb-8">
        Learn vocabulary from the world around you
      </Text>

      <Link href="/camera" asChild>
        <TouchableOpacity className="bg-blue-600 px-8 py-4 rounded-full flex-row items-center">
          <Ionicons name="camera" size={24} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">
            Start Learning
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
