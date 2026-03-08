/**
 * Common Tailwind class patterns for YouTube-inspired dark mode
 */

export const THEME_CLASSES = {
  // Screens
  screen: 'flex-1 bg-background-primary',

  // Cards
  card: 'bg-background-secondary rounded-xl p-4 border border-border-subtle',
  cardLarge: 'bg-background-secondary rounded-2xl p-6 border border-border-subtle',
  cardElevated: 'bg-background-tertiary rounded-xl p-4 border border-border-secondary',
  cardGradient: 'bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl p-6',

  // Buttons
  buttonPrimary: 'bg-accent-primary rounded-xl p-4 items-center active:bg-accent-primary/80',
  buttonSecondary: 'bg-accent-secondary rounded-xl p-4 items-center active:bg-accent-secondary/80',
  buttonSuccess: 'bg-accent-success rounded-xl p-4 items-center active:bg-accent-success/80',
  buttonOutline: 'bg-transparent border border-border-primary rounded-xl p-4 items-center active:bg-interactive-hover',
  buttonGhost: 'bg-transparent rounded-xl p-4 items-center active:bg-interactive-hover',

  // Text
  heading1: 'text-2xl font-bold text-text-primary',
  heading2: 'text-xl font-bold text-text-primary',
  heading3: 'text-lg font-semibold text-text-primary',
  body: 'text-base text-text-secondary',
  bodySmall: 'text-sm text-text-secondary',
  caption: 'text-xs text-text-tertiary',
  muted: 'text-text-disabled',

  // Status badges
  badgeSuccess: 'bg-accent-success/20 px-3 py-1 rounded-full border border-accent-success/30',
  badgeWarning: 'bg-accent-warning/20 px-3 py-1 rounded-full border border-accent-warning/30',
  badgeError: 'bg-accent-error/20 px-3 py-1 rounded-full border border-accent-error/30',
  badgeInfo: 'bg-accent-info/20 px-3 py-1 rounded-full border border-accent-info/30',
  badgePrimary: 'bg-accent-primary/20 px-3 py-1 rounded-full border border-accent-primary/30',

  // Progress bars
  progressBar: 'h-2 bg-background-tertiary rounded-full overflow-hidden',
  progressBarLarge: 'h-3 bg-background-tertiary rounded-full overflow-hidden',
  progressFill: 'h-full bg-accent-primary rounded-full',

  // Icons containers
  iconCircle: 'w-10 h-10 rounded-full items-center justify-center',
  iconCircleLarge: 'w-12 h-12 rounded-full items-center justify-center',

  // Spacing
  section: 'px-4 py-6',
  sectionLarge: 'px-6 py-8',
  gap: 'gap-3',
  gapLarge: 'gap-4',

  // Dividers
  divider: 'border-b border-border-subtle',
  dividerStrong: 'border-b border-border-primary',
} as const;
