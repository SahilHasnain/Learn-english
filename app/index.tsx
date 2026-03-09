import Flashback from "@/app/components/Flashback";
import { HomeHeader } from "@/app/components/HomeHeader";
import { OnboardingSheet } from "@/app/components/OnboardingSheet";
import { StatsCard } from "@/app/components/StatsCard";
import { useOnboarding } from "@/app/hooks/useOnboarding";
import { useStats } from "@/app/hooks/useStats";
import { COLORS, SPACING } from "@/theme";
import { useRouter } from "expo-router";
import { ScrollView, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActionButtons } from "./components/ActionButtons";
import { DictionarySheet } from "./components/DictionarySheet";
import { useDictionary } from "./hooks/useDictionary";

export default function Index() {
  const router = useRouter();
  const { stats } = useStats();
  const dictionary = useDictionary();
  const {
    bottomSheetRef,
    onboardingStep,
    currentLevel,
    currentLanguage,
    snapPoints,
    handleLanguageSelect,
    handleLevelSelect,
    openSettings,
    handleSheetChanges,
  } = useOnboarding();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.background.primary }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background.primary}
      />

      <HomeHeader
        currentLevel={currentLevel}
        currentLanguage={currentLanguage}
        onSettingsPress={openSettings}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: SPACING.lg,
          flexGrow: 1,
          justifyContent: "flex-end",
        }}
        showsVerticalScrollIndicator={false}
      >
        <StatsCard
          wordsToday={stats.wordsToday}
          totalWords={stats.totalWords}
          streak={stats.streak}
          onPress={() => router.push("/journey")}
        />

        {stats.totalWords > 0 && <Flashback />}

        <ActionButtons
          onJourneyPress={() => router.push("/journey")}
          onPracticePress={() => router.push("/practice")}
          onDictionaryPress={dictionary.open}
        />

        <View style={{ height: SPACING.xl }} />
      </ScrollView>

      <DictionarySheet
        visible={dictionary.visible}
        mode={dictionary.mode}
        query={dictionary.query}
        onQueryChange={dictionary.setQuery}
        result={dictionary.result}
        loading={dictionary.loading}
        error={dictionary.error}
        saved={dictionary.saved}
        onSearch={dictionary.search}
        onClose={dictionary.close}
        onToggleMode={dictionary.toggleMode}
        onSave={dictionary.saveWord}
      />

      <OnboardingSheet
        bottomSheetRef={bottomSheetRef}
        onboardingStep={onboardingStep}
        currentLevel={currentLevel}
        currentLanguage={currentLanguage}
        snapPoints={snapPoints}
        onLanguageSelect={handleLanguageSelect}
        onLevelSelect={handleLevelSelect}
        onSheetChange={handleSheetChanges}
      />
    </SafeAreaView>
  );
}
