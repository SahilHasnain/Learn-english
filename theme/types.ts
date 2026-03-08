/**
 * Type definitions for the theme system
 */

import { COLORS, DIFFICULTY_COLORS, STATUS_COLORS, SUBJECT_COLORS } from './colors';
import { BORDER_RADIUS, GRADIENTS, SHADOWS, SPACING } from './constants';
import { THEME_CLASSES } from './styles';

// Extract types from constants
export type ColorPalette = typeof COLORS;
export type SubjectType = keyof typeof SUBJECT_COLORS;
export type StatusType = keyof typeof STATUS_COLORS;
export type DifficultyType = keyof typeof DIFFICULTY_COLORS;
export type ThemeClass = keyof typeof THEME_CLASSES;
export type ShadowType = keyof typeof SHADOWS;
export type SpacingType = keyof typeof SPACING;
export type BorderRadiusType = keyof typeof BORDER_RADIUS;
export type GradientType = keyof typeof GRADIENTS;

// Component prop types
export interface ThemedComponentProps {
  className?: string;
  style?: any;
}

export interface SubjectThemedProps extends ThemedComponentProps {
  subject: SubjectType;
}

export interface StatusThemedProps extends ThemedComponentProps {
  status: StatusType;
}

export interface DifficultyThemedProps extends ThemedComponentProps {
  difficulty: DifficultyType;
}

export interface ScoreThemedProps extends ThemedComponentProps {
  score: number;
}
