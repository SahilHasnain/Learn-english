import { COLORS } from './colors';

/**
 * Shadow configurations (for React Native)
 */
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  accent: {
    shadowColor: COLORS.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

/**
 * Common spacing values
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/**
 * Border radius values
 */
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

/**
 * Gradient combinations for dark mode
 */
export const GRADIENTS = {
  primary: 'from-accent-primary to-accent-secondary',
  success: 'from-accent-success to-chemistry',
  physics: 'from-physics to-accent-secondary',
  chemistry: 'from-chemistry to-accent-success',
  biology: 'from-biology to-accent-primary',
  subtle: 'from-background-secondary to-background-tertiary',
} as const;
