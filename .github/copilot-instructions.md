# ScanLearn — Copilot Workspace Instructions

## Project Overview

**ScanLearn** is an English learning app for South Asian learners (Hindi/Urdu speakers). Users point their camera at objects to learn vocabulary in context with native-language translations. Built with React Native + Expo, AI-powered by Groq.

## Tech Stack

| Layer         | Technology                                                                |
| ------------- | ------------------------------------------------------------------------- |
| Framework     | React Native 0.81, Expo 54, TypeScript (strict)                           |
| Styling       | Nativewind (Tailwind CSS compiled to native StyleSheets)                  |
| AI            | Groq API — `llama-4-scout-17b` (vision), `llama-3.3-70b-versatile` (text) |
| Backend       | Appwrite (API key storage only)                                           |
| Local Storage | AsyncStorage (user prefs, learned words, journey data)                    |
| Navigation    | Expo Router (file-based Stack navigation)                                 |

## Commands

```bash
npm start              # Start Expo dev server
npm run android        # Run on Android
npm run ios            # Run on iOS
npm run web            # Run on web
npm run lint           # ESLint
npm run setup-db       # Initialize Appwrite database
npm run build:dev      # EAS development build
npm run build:prev     # EAS preview build
npm run build:prod     # EAS production build
```

## Project Structure

```
app/                    # Expo Router screens (Stack nav, no tabs)
  _layout.tsx           # Root layout — GestureHandlerRootView wrapper
  index.tsx             # Home — stats, onboarding (BottomSheet modals), dictionary
  camera.tsx            # Camera capture → Groq vision
  results.tsx           # Displays 3 AI-identified words
  journey.tsx           # Learning journey & insights
  practice.tsx          # Practice exercises
  components/           # Shared UI components

services/               # Business logic (async, promise-based)
  groqService.ts        # All Groq AI calls (vision, conversations, fixes, flashcards)
  appwriteConfig.ts     # Appwrite client + API key fetching with cache
  learningJourneyService.ts  # AsyncStorage: sessions, insights, streaks
  storageService.ts     # User preferences + saved word bookmarks

theme/                  # Centralized design system
  colors.ts             # Color palette (YouTube-dark inspired)
  constants.ts          # Spacing, border radius, font sizes
  styles.ts             # Reusable style objects + shadows
  types.ts              # Theme TypeScript types
  helpers.ts            # Style utility functions
  index.ts              # Barrel export
```

## Coding Conventions

### Imports

- Always use the `@/` path alias (maps to project root) for all imports.
- Import theme values from `@/theme` barrel: `import { COLORS, SPACING, SHADOWS } from "@/theme"`.

### Components

- Functional components with hooks only — no class components.
- Use `Ionicons` for all icons with consistent sizing.
- Expandable sections use `@gorhom/bottom-sheet`.
- Graceful degradation: return `null` silently when data is unavailable.

### Styling

- **Never hardcode hex colors** — always use `COLORS.*` from the theme.
- **Never hardcode spacing values** — always use `SPACING.*` (xs=4, sm=8, md=16, lg=24, xl=32, xxl=48).
- Mix inline `style` objects (using theme constants) with Nativewind `className` props.
- Use `SHADOWS.sm | md | lg` for elevation.

### Services

- All service functions are `async` with `try/catch` and descriptive `console.error`.
- Services throw errors; components catch and handle them.
- Groq prompts are language-aware — they adapt output for Hindi/Urdu/English based on user preference.
- API key caching in `appwriteConfig.ts` prevents repeated Appwrite queries.

### TypeScript

- Strict mode enabled. Explicit types on all function signatures.
- No implicit `any`.

### File Naming

- **PascalCase** for component files (`WordCard.tsx`, `ConversationFlow.tsx`).
- **camelCase** for service/utility files (`groqService.ts`, `storageService.ts`).

## AI Integration Details

Groq service returns structured JSON from all endpoints. Key patterns:

- Vision analysis returns exactly **3 words** per image (beginner/intermediate/advanced).
- Conversation starters use South Asian scenarios (chai, traffic, festivals).
- Error correction is L1-aware (detects common Hindi/Urdu speaker mistakes: articles, prepositions, tense).
- All Groq responses are JSON-parsed from model output.

## Data Flow

```
User Preferences (AsyncStorage)
  ├─ language: hindi | urdu | english
  └─ level: beginner | intermediate | advanced
       ↓
Groq AI Services (prompt customization per language/level)
       ↓
Learning Journey (AsyncStorage: words, sessions, insights)
```

## Environment Setup

Requires `.env.local` at project root:

```
EXPO_PUBLIC_GROQ_API_KEY=gsk_...
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://...
EXPO_PUBLIC_APPWRITE_PROJECT_ID=...
```

**Restart the dev server** after changing env vars.

## Pitfalls

- Groq vision analysis takes 2-5s per image — don't add loading state assumptions that conflict with this.
- AI features require internet; AsyncStorage-based features work offline.
- The `language` setting affects both UI labels and AI prompt templates — keep them in sync.
- Groq model identifiers are pinned; check `groqService.ts` before assuming model names.
