import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SavedWord {
  id: string;
  word: string;
  level: "beginner" | "intermediate" | "advanced";
  sentence: string;
  savedAt: string;
}

const STORAGE_KEY = "@saved_words";

export async function getSavedWords(): Promise<SavedWord[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting saved words:", error);
    return [];
  }
}

export async function saveWord(
  word: string,
  level: "beginner" | "intermediate" | "advanced",
  sentence: string,
): Promise<boolean> {
  try {
    const savedWords = await getSavedWords();

    // Check if word already exists
    const exists = savedWords.some(
      (w) => w.word.toLowerCase() === word.toLowerCase(),
    );
    if (exists) {
      return false; // Already saved
    }

    const newWord: SavedWord = {
      id: Date.now().toString(),
      word,
      level,
      sentence,
      savedAt: new Date().toISOString(),
    };

    const updatedWords = [newWord, ...savedWords];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWords));
    return true;
  } catch (error) {
    console.error("Error saving word:", error);
    throw error;
  }
}

export async function removeWord(id: string): Promise<void> {
  try {
    const savedWords = await getSavedWords();
    const updatedWords = savedWords.filter((w) => w.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWords));
  } catch (error) {
    console.error("Error removing word:", error);
    throw error;
  }
}

export async function isWordSaved(word: string): Promise<boolean> {
  try {
    const savedWords = await getSavedWords();
    return savedWords.some((w) => w.word.toLowerCase() === word.toLowerCase());
  } catch (error) {
    console.error("Error checking if word is saved:", error);
    return false;
  }
}
