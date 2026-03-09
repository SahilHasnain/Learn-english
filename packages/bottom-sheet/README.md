# BottomSheet

A simple, reusable Modal-based bottom sheet for React Native with built-in keyboard handling.

## Install into any project

```bash
npx degit yourusername/scanlearn/packages/bottom-sheet ./components/bottom-sheet
```

Then import:

```tsx
import BottomSheet from "./components/bottom-sheet/BottomSheet";
```

## Dependencies

Only `react` and `react-native` — no third-party libraries needed.

## Usage

```tsx
const [visible, setVisible] = useState(false);

<BottomSheet
  visible={visible}
  onClose={() => setVisible(false)}
  title="My Sheet"
  maxHeight="60%"
>
  <Text>Your content here</Text>
  <TextInput placeholder="Keyboard will push this up" />
</BottomSheet>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | required | Show/hide the sheet |
| `onClose` | `() => void` | required | Called on close/back |
| `title` | `string` | — | Header title |
| `maxHeight` | `string` | `"60%"` | Max sheet height |
| `headerRight` | `ReactNode` | — | Extra elements in header (e.g. toggle) |
| `titleIcon` | `ReactNode` | — | Icon before the title |
| `children` | `ReactNode` | required | Sheet content |
| `backgroundColor` | `string` | `#1f1f1f` | Sheet background |
| `overlayColor` | `string` | `rgba(0,0,0,0.5)` | Backdrop color |
| `borderColor` | `string` | `#272727` | Header border color |
| `textColor` | `string` | `#ffffff` | Title/close text color |
| `closeButtonBg` | `string` | `#272727` | Close button background |

## Files

- `BottomSheet.tsx` — The main component
- `KeyboardSpacer.tsx` — Keyboard-aware spacer (used internally, also usable standalone)
