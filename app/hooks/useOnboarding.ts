import {
    EnglishLevel,
    LearningLanguage,
    getEnglishLevel,
    getLearningLanguage,
    saveEnglishLevel,
    saveLearningLanguage,
} from "@/services/storageService";
import { BottomSheetMethods } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useOnboarding() {
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const [onboardingStep, setOnboardingStep] = useState<"language" | "level">("language");
  const [currentLevel, setCurrentLevel] = useState<EnglishLevel | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<LearningLanguage | null>(null);

  const snapPoints = useMemo(() => ["55%"], []);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const language = await getLearningLanguage();
    const level = await getEnglishLevel();
    setCurrentLanguage(language);
    setCurrentLevel(level);
    if (!language) {
      setOnboardingStep("language");
      bottomSheetRef.current?.expand();
    } else if (!level) {
      setOnboardingStep("level");
      bottomSheetRef.current?.expand();
    }
  };

  const handleLanguageSelect = async (language: LearningLanguage) => {
    await saveLearningLanguage(language);
    setCurrentLanguage(language);
    setOnboardingStep("level");
  };

  const handleLevelSelect = async (level: EnglishLevel) => {
    await saveEnglishLevel(level);
    setCurrentLevel(level);
    bottomSheetRef.current?.close();
  };

  const openSettings = () => {
    setOnboardingStep("language");
    bottomSheetRef.current?.expand();
  };

  const handleSheetChanges = useCallback(() => {
    // -1 means closed
  }, []);

  return {
    bottomSheetRef,
    onboardingStep,
    currentLevel,
    currentLanguage,
    snapPoints,
    handleLanguageSelect,
    handleLevelSelect,
    openSettings,
    handleSheetChanges,
  };
}
