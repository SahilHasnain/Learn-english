import { getTodayStats } from "@/services/learningJourneyService";
import { useEffect, useState } from "react";

export function useStats() {
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

  return { stats, loadStats };
}
