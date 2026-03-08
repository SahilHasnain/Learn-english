# Centralized Theme System

YouTube-inspired dark mode theme for the educational app.

## 📁 Structure

```
theme/
├── index.ts          # Main export file (import from here)
├── colors.ts         # Color definitions and mappings
├── styles.ts         # Tailwind class patterns
├── constants.ts      # Shadows, spacing, border radius, gradients
├── helpers.ts        # Helper functions for dynamic colors
└── README.md         # This file
```

## 🎨 Usage

### Import Everything

```typescript
import { 
  COLORS, 
  THEME_CLASSES, 
  SHADOWS, 
  SPACING,
  getSubjectColor,
  getScoreColor 
} from '@/theme';
```

### Using Colors in Components

```typescript
import { COLORS } from '@/theme';

// Direct color usage
<View style={{ backgroundColor: COLORS.background.primary }}>
  <Text style={{ color: COLORS.text.primary }}>Hello</Text>
</View>
```

### Using Tailwind Classes

```typescript
import { THEME_CLASSES } from '@/theme';

// Use predefined class patterns
<View className={THEME_CLASSES.card}>
  <Text className={THEME_CLASSES.heading1}>Title</Text>
  <Text className={THEME_CLASSES.body}>Description</Text>
</View>

// Or use Tailwind directly with theme colors
<View className="bg-background-secondary rounded-xl p-4">
  <Text className="text-text-primary text-xl font-bold">Title</Text>
</View>
```

### Using Helper Functions

```typescript
import { getSubjectColor, getScoreColor, getDifficultyColor } from '@/theme';

// Get subject-specific color
const physicsColor = getSubjectColor('Physics'); // Returns #3b82f6

// Get score-based color
const scoreColor = getScoreColor(85); // Returns success green

// Get difficulty color
const diffColor = getDifficultyColor('hard'); // Returns error red
```

### Using Shadows

```typescript
import { SHADOWS } from '@/theme';

<View style={[styles.card, SHADOWS.md]}>
  <Text>Card with shadow</Text>
</View>
```

### Using Spacing

```typescript
import { SPACING } from '@/theme';

<View style={{ padding: SPACING.md, gap: SPACING.sm }}>
  {/* Content */}
</View>
```

## 🎯 Color Categories

### Background Colors
- `background.primary` - Main app background (#0f0f0f)
- `background.secondary` - Cards, sections (#1f1f1f)
- `background.tertiary` - Elevated cards (#272727)
- `background.elevated` - Highest elevation (#3f3f3f)

### Text Colors
- `text.primary` - Main text (#ffffff)
- `text.secondary` - Secondary text (#aaaaaa)
- `text.tertiary` - Subtle text (#717171)
- `text.disabled` - Disabled state (#525252)

### Accent Colors
- `accent.primary` - Purple (#8b5cf6) - Primary actions
- `accent.secondary` - Blue (#3b82f6) - Secondary actions
- `accent.success` - Green (#10b981) - Success states
- `accent.error` - Red (#ef4444) - Error states
- `accent.warning` - Orange (#f59e0b) - Warning states
- `accent.info` - Cyan (#06b6d4) - Info states

### Subject Colors
- `physics` - Blue (#3b82f6)
- `chemistry` - Green (#10b981)
- `biology` - Pink (#ec4899)

## 📦 Predefined Styles

### Cards
- `THEME_CLASSES.card` - Standard card
- `THEME_CLASSES.cardLarge` - Large card with more padding
- `THEME_CLASSES.cardElevated` - Elevated card
- `THEME_CLASSES.cardGradient` - Gradient card

### Buttons
- `THEME_CLASSES.buttonPrimary` - Primary button
- `THEME_CLASSES.buttonSecondary` - Secondary button
- `THEME_CLASSES.buttonSuccess` - Success button
- `THEME_CLASSES.buttonOutline` - Outline button
- `THEME_CLASSES.buttonGhost` - Ghost button

### Text Styles
- `THEME_CLASSES.heading1` - Large heading
- `THEME_CLASSES.heading2` - Medium heading
- `THEME_CLASSES.heading3` - Small heading
- `THEME_CLASSES.body` - Body text
- `THEME_CLASSES.bodySmall` - Small body text
- `THEME_CLASSES.caption` - Caption text
- `THEME_CLASSES.muted` - Muted text

### Badges
- `THEME_CLASSES.badgeSuccess` - Success badge
- `THEME_CLASSES.badgeWarning` - Warning badge
- `THEME_CLASSES.badgeError` - Error badge
- `THEME_CLASSES.badgeInfo` - Info badge
- `THEME_CLASSES.badgePrimary` - Primary badge

## 🔧 Constants

### Shadows
- `SHADOWS.sm` - Small shadow
- `SHADOWS.md` - Medium shadow
- `SHADOWS.lg` - Large shadow
- `SHADOWS.accent` - Accent-colored shadow

### Spacing
- `SPACING.xs` - 4px
- `SPACING.sm` - 8px
- `SPACING.md` - 16px
- `SPACING.lg` - 24px
- `SPACING.xl` - 32px
- `SPACING.xxl` - 48px

### Border Radius
- `BORDER_RADIUS.sm` - 8px
- `BORDER_RADIUS.md` - 12px
- `BORDER_RADIUS.lg` - 16px
- `BORDER_RADIUS.xl` - 24px
- `BORDER_RADIUS.full` - 9999px

## 🌈 Gradients

Use with Tailwind's `bg-gradient-to-br` or similar:

```typescript
import { GRADIENTS } from '@/theme';

<View className={`bg-gradient-to-br ${GRADIENTS.primary} p-6`}>
  {/* Content */}
</View>
```

Available gradients:
- `GRADIENTS.primary` - Purple to blue
- `GRADIENTS.success` - Green gradient
- `GRADIENTS.physics` - Physics theme
- `GRADIENTS.chemistry` - Chemistry theme
- `GRADIENTS.biology` - Biology theme
- `GRADIENTS.subtle` - Subtle background gradient

## 💡 Best Practices

1. Always import from `@/theme` for consistency
2. Use `THEME_CLASSES` for common patterns
3. Use helper functions for dynamic colors
4. Prefer Tailwind classes for responsive design
5. Use `SHADOWS` for consistent elevation
6. Use `SPACING` constants for consistent spacing

## 🔄 Migration Guide

Replace hardcoded colors with theme imports:

```typescript
// Before
<View style={{ backgroundColor: '#1f1f1f' }}>

// After
import { COLORS } from '@/theme';
<View style={{ backgroundColor: COLORS.background.secondary }}>

// Or with Tailwind
<View className="bg-background-secondary">
```
