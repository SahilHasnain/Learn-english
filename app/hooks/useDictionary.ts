import { DictionaryEntry, lookupWord, reverseLookupWord } from "@/services/groqService";
import { saveLearnedWords } from "@/services/learningJourneyService";
import { getLearningLanguage } from "@/services/storageService";
import { useCallback, useState } from "react";

export type DictMode = "en" | "reverse";

export function useDictionary() {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<DictMode>("en");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const open = useCallback(() => {
    setQuery("");
    setResult(null);
    setError(null);
    setSaved(false);
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((m) => (m === "en" ? "reverse" : "en"));
    setQuery("");
    setResult(null);
    setError(null);
    setSaved(false);
  }, []);

  const search = useCallback(async (word: string) => {
    const trimmed = word.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);

    try {
      const language = (await getLearningLanguage()) ?? "hindi";
      const entry =
        mode === "en"
          ? await lookupWord(trimmed, language)
          : await reverseLookupWord(trimmed, language);
      setResult(entry);
    } catch {
      setError("Couldn't look up that word. Try again.");
    } finally {
      setLoading(false);
    }
  }, [mode]);

  const saveWord = useCallback(async () => {
    if (!result || saved) return;
    await saveLearnedWords([
      {
        word: result.word,
        hindiMeaning: result.meaning,
        level: result.level,
        timestamp: Date.now(),
        context: "dictionary",
      },
    ]);
    setSaved(true);
  }, [result, saved]);

  return {
    visible,
    mode,
    query,
    setQuery,
    result,
    loading,
    error,
    saved,
    open,
    close,
    toggleMode,
    search,
    saveWord,
  };
}
