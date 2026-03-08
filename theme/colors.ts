/**
 * Centralized Theme Configuration
 * YouTube Dark Mode inspired with educational app colors
 */

export const COLORS = {
  // Background colors - YouTube Dark Mode inspired
  background: {
    primary: '#0f0f0f',    // Main background (YouTube dark gray)
    secondary: '#1f1f1f',  // Secondary background (slightly lighter)
    tertiary: '#272727',   // Tertiary background (cards, elevated)
    elevated: '#3f3f3f',   // Elevated surfaces
  },

  // Text colors
  text: {
    primary: '#ffffff',    // Primary text (white)
    secondary: '#aaaaaa',  // Secondary text (lighter gray)
    tertiary: '#717171',   // Tertiary text (medium gray)
    disabled: '#525252',   // Disabled text
  },

  // Border colors
  border: {
    primary: '#3f3f3f',    // Primary borders
    secondary: '#272727',  // Secondary borders
    subtle: '#1f1f1f',     // Subtle borders
  },

  // Accent colors - Educational theme
  accent: {
    primary: '#8b5cf6',    // Purple - primary actions (study, learn)
    secondary: '#3b82f6',  // Blue - secondary actions
    success: '#10b981',    // Green - success/completion
    error: '#ef4444',      // Red - errors
    warning: '#f59e0b',    // Orange - warnings
    info: '#06b6d4',       // Cyan - info
  },

  // Interactive states
  interactive: {
    hover: '#525252',      // Hover state
    active: '#717171',     // Active/pressed state
    disabled: '#272727',   // Disabled state
  },

  // Subject-specific colors
  physics: {
    DEFAULT: '#3b82f6',    // Blue
    light: '#60a5fa',
  },
  chemistry: {
    DEFAULT: '#10b981',    // Green
    light: '#34d399',
  },
  biology: {
    DEFAULT: '#ec4899',    // Pink
    light: '#f472b6',
  },

  // Overlay colors (with opacity)
  overlay: {
    dark: 'rgba(0, 0, 0, 0.8)',
    medium: 'rgba(0, 0, 0, 0.5)',
    light: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

// Subject color mapping
export const SUBJECT_COLORS = {
  Physics: COLORS.physics,
  Chemistry: COLORS.chemistry,
  Biology: COLORS.biology,
} as const;

// Status color mapping
export const STATUS_COLORS = {
  completed: COLORS.accent.success,
  unlocked: COLORS.accent.primary,
  locked: COLORS.text.disabled,
  in_progress: COLORS.accent.warning,
  active: COLORS.accent.primary,
  paused: COLORS.accent.warning,
  archived: COLORS.text.disabled,
} as const;

// Difficulty colors
export const DIFFICULTY_COLORS = {
  easy: COLORS.accent.success,
  medium: COLORS.accent.warning,
  hard: COLORS.accent.error,
} as const;
