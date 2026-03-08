import AsyncStorage from "@react-native-async-storage/async-storage";

interface LearnedWord {
  word: string;
  hindiMeaning: string;
  level: string;
  timestamp: number;
  context?: string; // What object was scanned
}

interface LearningSession {
  id: string;
  words: LearnedWord[];
  timestamp: number;
  location?: string;
}

interface LearningInsight {
  type: "pattern" | "milestone" | "suggestion";
  title: string;
  message: string;
  icon: string;
}

const STORAGE_KEY = "@learning_journey";
const SESSIONS_KEY = "@learning_sessions";

export async function saveLearnedWords(
  words: LearnedWord[],
  context?: string,
): Promise<void> {
  try {
    // Get existing words
    const existing = await getAllLearnedWords();

    // Add new words with timestamp
    const newWords = words.map((word) => ({
      ...word,
      timestamp: Date.now(),
      context,
    }));

    const updated = [...existing, ...newWords];

    // Save updated list
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Save as a session
    const session: LearningSession = {
      id: Date.now().toString(),
      words: newWords,
      timestamp: Date.now(),
    };

    const sessions = await getAllSessions();
    await AsyncStorage.setItem(
      SESSIONS_KEY,
      JSON.stringify([...sessions, session]),
    );
  } catch (error) {
    console.error("Error saving learned words:", error);
  }
}

export async function getAllLearnedWords(): Promise<LearnedWord[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting learned words:", error);
    return [];
  }
}

export async function getAllSessions(): Promise<LearningSession[]> {
  try {
    const data = await AsyncStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting sessions:", error);
    return [];
  }
}

export async function getLearningInsights(): Promise<LearningInsight[]> {
  const words = await getAllLearnedWords();
  const sessions = await getAllSessions();
  const insights: LearningInsight[] = [];

  if (words.length === 0) return insights;

  // Milestone insights
  if (words.length >= 10) {
    insights.push({
      type: "milestone",
      title: "Great Progress!",
      message: `You've learned ${words.length} words! Keep building your vocabulary.`,
      icon: "trophy",
    });
  }

  // Pattern detection - find common categories
  const categories = detectCategories(words);
  if (categories.length > 0) {
    const topCategory = categories[0];
    insights.push({
      type: "pattern",
      title: "Learning Pattern Detected",
      message: `You're learning lots of ${topCategory.name} words! You've scanned ${topCategory.count} ${topCategory.name}-related items.`,
      icon: "analytics",
    });
  }

  // Time-based insights
  const today = new Date().setHours(0, 0, 0, 0);
  const todayWords = words.filter((w) => w.timestamp >= today);

  if (todayWords.length > 0) {
    insights.push({
      type: "milestone",
      title: "Today's Learning",
      message: `You've learned ${todayWords.length} new ${todayWords.length === 1 ? "word" : "words"} today!`,
      icon: "calendar",
    });
  }

  // Streak detection
  const streak = calculateStreak(sessions);
  if (streak > 1) {
    insights.push({
      type: "milestone",
      title: `${streak} Day Streak! 🔥`,
      message: `You're on fire! Keep learning every day.`,
      icon: "flame",
    });
  }

  // Smart suggestions based on patterns
  if (categories.length > 0) {
    const topCategory = categories[0];
    insights.push({
      type: "suggestion",
      title: "Expand Your Vocabulary",
      message: `Since you're learning ${topCategory.name} words, try scanning more items in that category to build deeper knowledge!`,
      icon: "bulb",
    });
  }

  return insights;
}

function detectCategories(
  words: LearnedWord[],
): { name: string; count: number }[] {
  const contextCounts: Record<string, number> = {};

  words.forEach((word) => {
    if (word.context) {
      contextCounts[word.context] = (contextCounts[word.context] || 0) + 1;
    }
  });

  return Object.entries(contextCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function calculateStreak(sessions: LearningSession[]): number {
  if (sessions.length === 0) return 0;

  const sortedSessions = sessions.sort((a, b) => b.timestamp - a.timestamp);
  let streak = 1;
  let currentDate = new Date(sortedSessions[0].timestamp).setHours(0, 0, 0, 0);

  for (let i = 1; i < sortedSessions.length; i++) {
    const sessionDate = new Date(sortedSessions[i].timestamp).setHours(
      0,
      0,
      0,
      0,
    );
    const dayDiff = (currentDate - sessionDate) / (1000 * 60 * 60 * 24);

    if (dayDiff === 1) {
      streak++;
      currentDate = sessionDate;
    } else if (dayDiff > 1) {
      break;
    }
  }

  return streak;
}

export async function getTodayStats(): Promise<{
  wordsToday: number;
  totalWords: number;
  streak: number;
}> {
  const words = await getAllLearnedWords();
  const sessions = await getAllSessions();

  const today = new Date().setHours(0, 0, 0, 0);
  const todayWords = words.filter((w) => w.timestamp >= today);

  return {
    wordsToday: todayWords.length,
    totalWords: words.length,
    streak: calculateStreak(sessions),
  };
}

export interface DayGroup {
  label: string;
  dateKey: string;
  sessions: LearningSession[];
}

export async function getSessionsByDay(): Promise<DayGroup[]> {
  const sessions = await getAllSessions();
  if (sessions.length === 0) return [];

  const sorted = [...sessions].sort((a, b) => b.timestamp - a.timestamp);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: Map<string, { label: string; sessions: LearningSession[] }> =
    new Map();

  for (const session of sorted) {
    const sessionDate = new Date(session.timestamp);
    sessionDate.setHours(0, 0, 0, 0);
    const dateKey = sessionDate.toISOString().split("T")[0];

    let label: string;
    if (sessionDate.getTime() === today.getTime()) {
      label = "Today";
    } else if (sessionDate.getTime() === yesterday.getTime()) {
      label = "Yesterday";
    } else {
      label = sessionDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }

    if (!groups.has(dateKey)) {
      groups.set(dateKey, { label, sessions: [] });
    }
    groups.get(dateKey)!.sessions.push(session);
  }

  return Array.from(groups.entries()).map(([dateKey, group]) => ({
    dateKey,
    label: group.label,
    sessions: group.sessions,
  }));
}
