import { COLORS, DIFFICULTY_COLORS, STATUS_COLORS, SUBJECT_COLORS } from './colors';

/**
 * Helper function to get subject color
 */
export const getSubjectColor = (subject: 'Physics' | 'Chemistry' | 'Biology') => {
  return SUBJECT_COLORS[subject];
};

/**
 * Helper function to get status color
 */
export const getStatusColor = (status: keyof typeof STATUS_COLORS) => {
  return STATUS_COLORS[status] || COLORS.text.disabled;
};

/**
 * Helper function to get difficulty color
 */
export const getDifficultyColor = (difficulty: keyof typeof DIFFICULTY_COLORS) => {
  return DIFFICULTY_COLORS[difficulty] || COLORS.text.disabled;
};

/**
 * Helper function to get score-based color
 */
export const getScoreColor = (score: number) => {
  if (score >= 80) return COLORS.accent.success;
  if (score >= 60) return COLORS.accent.primary;
  if (score >= 40) return COLORS.accent.warning;
  return COLORS.accent.error;
};
