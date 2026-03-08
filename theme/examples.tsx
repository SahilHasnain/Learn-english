/**
 * Theme Usage Examples
 * Copy these patterns into your components
 */

import {
    COLORS,
    SHADOWS,
    SPACING,
    THEME_CLASSES,
    getDifficultyColor,
    getScoreColor,
    getSubjectColor
} from '@/theme';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// Example 1: Using THEME_CLASSES with Tailwind
export const CardExample = () => (
  <View className={THEME_CLASSES.card}>
    <Text className={THEME_CLASSES.heading2}>Card Title</Text>
    <Text className={THEME_CLASSES.body}>Card description goes here</Text>
  </View>
);

// Example 2: Using direct colors with inline styles
export const ColorExample = () => (
  <View style={{ backgroundColor: COLORS.background.secondary, padding: SPACING.md }}>
    <Text style={{ color: COLORS.text.primary, fontSize: 18 }}>
      Direct Color Usage
    </Text>
  </View>
);

// Example 3: Button with theme classes
export const ButtonExample = () => (
  <TouchableOpacity className={THEME_CLASSES.buttonPrimary}>
    <Text className="text-white font-semibold">Primary Button</Text>
  </TouchableOpacity>
);

// Example 4: Using helper functions for dynamic colors
export const SubjectCardExample = ({ subject }: { subject: 'Physics' | 'Chemistry' | 'Biology' }) => {
  const subjectColor = getSubjectColor(subject);
  
  return (
    <View className={THEME_CLASSES.card}>
      <View 
        className="w-12 h-12 rounded-full items-center justify-center mb-3"
        style={{ backgroundColor: subjectColor.DEFAULT }}
      >
        <Text className="text-white font-bold">{subject[0]}</Text>
      </View>
      <Text className={THEME_CLASSES.heading3}>{subject}</Text>
    </View>
  );
};

// Example 5: Score-based coloring
export const ScoreDisplayExample = ({ score }: { score: number }) => {
  const scoreColor = getScoreColor(score);
  
  return (
    <View className={THEME_CLASSES.card}>
      <Text className={THEME_CLASSES.body}>Your Score</Text>
      <Text 
        className="text-4xl font-bold mt-2"
        style={{ color: scoreColor }}
      >
        {score}%
      </Text>
    </View>
  );
};

// Example 6: Progress bar
export const ProgressBarExample = ({ progress }: { progress: number }) => (
  <View className={THEME_CLASSES.progressBar}>
    <View 
      className={THEME_CLASSES.progressFill}
      style={{ width: `${progress}%` }}
    />
  </View>
);

// Example 7: Badge with status
export const StatusBadgeExample = ({ status }: { status: 'completed' | 'in_progress' | 'locked' }) => {
  const badgeClass = status === 'completed' 
    ? THEME_CLASSES.badgeSuccess 
    : status === 'in_progress'
    ? THEME_CLASSES.badgeWarning
    : THEME_CLASSES.badgePrimary;
    
  return (
    <View className={badgeClass}>
      <Text className="text-xs font-semibold capitalize">{status.replace('_', ' ')}</Text>
    </View>
  );
};

// Example 8: Card with shadow
export const ElevatedCardExample = () => (
  <View 
    className={THEME_CLASSES.cardLarge}
    style={SHADOWS.md}
  >
    <Text className={THEME_CLASSES.heading1}>Elevated Card</Text>
    <Text className={THEME_CLASSES.body}>This card has a shadow</Text>
  </View>
);

// Example 9: Gradient card
export const GradientCardExample = () => (
  <View className={THEME_CLASSES.cardGradient}>
    <Text className="text-white text-xl font-bold">Gradient Card</Text>
    <Text className="text-white/80 mt-2">Beautiful gradient background</Text>
  </View>
);

// Example 10: Difficulty indicator
export const DifficultyBadgeExample = ({ difficulty }: { difficulty: 'easy' | 'medium' | 'hard' }) => {
  const diffColor = getDifficultyColor(difficulty);
  
  return (
    <View 
      className="px-3 py-1 rounded-full"
      style={{ backgroundColor: `${diffColor}33`, borderColor: `${diffColor}66`, borderWidth: 1 }}
    >
      <Text style={{ color: diffColor }} className="text-xs font-semibold capitalize">
        {difficulty}
      </Text>
    </View>
  );
};

// Example 11: Full screen layout
export const ScreenLayoutExample = () => (
  <View className={THEME_CLASSES.screen}>
    <View className={THEME_CLASSES.section}>
      <Text className={THEME_CLASSES.heading1}>Screen Title</Text>
      <Text className={THEME_CLASSES.body}>Screen content goes here</Text>
    </View>
  </View>
);

// Example 12: List with dividers
export const ListExample = () => (
  <View className={THEME_CLASSES.card}>
    <View className="py-3">
      <Text className={THEME_CLASSES.body}>Item 1</Text>
    </View>
    <View className={THEME_CLASSES.divider} />
    <View className="py-3">
      <Text className={THEME_CLASSES.body}>Item 2</Text>
    </View>
    <View className={THEME_CLASSES.divider} />
    <View className="py-3">
      <Text className={THEME_CLASSES.body}>Item 3</Text>
    </View>
  </View>
);
