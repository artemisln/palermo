# App Playbook

Reusable architecture, conventions, and standards extracted from **Palermo** — a React Native (Expo) social deduction party game. Use this as the spec and standards doc when building new apps.

---

## 1. Executive Summary

Palermo is a single-device, offline party game built with Expo + React Native. What makes it feel smooth:

- **Single reducer** for all game state — predictable, debuggable, undo-able
- **Phase-based rendering** — one screen, no navigation stack, components swap in/out
- **Dark-first design system** with a tight 12-color palette
- **Audio-driven narration** with graceful fallback to timed steps
- **Zero network calls** — fully offline, fast, no loading spinners
- **Bilingual from day one** — simple JSON-based i18n with typed keys

**Stack:** Expo SDK, React Native, TypeScript (strict), expo-av, expo-router, AsyncStorage, react-native-reanimated.

---

## 2. Repository Structure & Conventions

### Folder Tree

```
project/
├── app/                    # Expo Router screens (entry points)
│   ├── _layout.tsx         # Root stack config + StatusBar
│   └── index.tsx           # Main screen (renders phase components)
├── components/
│   ├── game/               # Feature components (one per game phase)
│   │   ├── setup-phase.tsx
│   │   ├── role-reveal-phase.tsx
│   │   ├── night-intro-phase.tsx
│   │   ├── voting-phase.tsx
│   │   ├── night-kill-phase.tsx
│   │   ├── end-phase.tsx
│   │   ├── settings-modal.tsx
│   │   └── player-list.tsx
│   └── ui/                 # Reusable, app-agnostic UI primitives
│       ├── button.tsx
│       ├── back-button.tsx
│       └── fade-view.tsx
├── hooks/                  # Custom React hooks
│   ├── use-game-reducer.ts
│   ├── use-game-storage.ts
│   ├── use-messages.ts
│   └── use-narration-audio.ts
├── lib/                    # Pure business logic (no React imports)
│   ├── game-types.ts       # Types, interfaces, constants
│   ├── game-reducer.ts     # State machine / reducer
│   ├── role-assignment.ts  # Domain algorithm
│   ├── win-conditions.ts   # Domain algorithm
│   ├── narration.ts        # Audio file maps + narration text
│   └── messages.ts         # i18n translation function
├── constants/
│   └── theme.ts            # Color tokens, font families
├── assets/
│   ├── audio/{el,en}/      # Narration MP3s per language
│   ├── audio/effects/      # Sound effects
│   ├── messages/{en,el}.json  # Translation files
│   └── images/             # Icons, splash, screenshots
├── docs/                   # Product docs, App Store content
├── app.json                # Expo config
├── eas.json                # EAS Build profiles
├── tsconfig.json           # TypeScript (strict)
└── package.json
```

### Naming Rules

| Thing | Convention | Example |
|-------|-----------|---------|
| Files | `kebab-case.ts(x)` | `night-kill-phase.tsx` |
| Components | `PascalCase` export | `export function VotingPhase()` |
| Hooks | `use-kebab-case.ts` | `use-game-reducer.ts` |
| Types/Interfaces | `PascalCase` | `GameState`, `Player` |
| Constants | `UPPER_SNAKE` | `INITIAL_STATE`, `DEFAULT_SETTINGS` |
| Action types | `UPPER_SNAKE` strings | `'ELIMINATE_PLAYER'` |
| Asset keys | `camelCase` | `nightFalls`, `killersWake` |
| AsyncStorage keys | `appname_camelCase` | `palermo_lastPlayers` |

### Golden Rules

- **DO** keep `lib/` free of React imports — pure TypeScript logic only
- **DO** co-locate styles with components using `StyleSheet.create()` at the bottom of each file
- **DO** use the `@/` path alias for all imports (maps to project root)
- **DO** export named functions, not default exports (except screen components)
- **DON'T** create wrapper files or re-export barrels — import directly
- **DON'T** put business logic in components — dispatch actions to the reducer
- **DON'T** use inline styles — always use `StyleSheet.create()`

### How to Add a New Feature

1. Add types to `lib/game-types.ts` (new phase, action, or state fields)
2. Add reducer cases to `lib/game-reducer.ts`
3. Create component in `components/game/` (or `components/ui/` if reusable)
4. Add i18n keys to both `assets/messages/en.json` and `el.json`
5. Wire into the phase switch in `app/index.tsx`
6. Add audio files to `assets/audio/{en,el}/` if narrated

---

## 3. Architecture Overview

### Pattern: Phase-Based State Machine

The app uses a **single-screen, reducer-driven state machine**. There is no navigation stack — the root component renders different phase components based on `state.phase`.

```
app/index.tsx (GameScreen)
    └── useGameReducer() → [state, dispatch, canGoBack, goBack]
    └── switch (state.phase)
        ├── SETUP         → <SetupPhase />
        ├── ROLE_REVEAL   → <RoleRevealPhase />
        ├── NIGHT_INTRO   → <NightIntroPhase />
        ├── VOTING        → <VotingPhase />
        ├── NIGHT_KILL    → <NightKillPhase />
        └── END           → <EndPhase />
```

### Layers

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **UI** | `components/`, `app/` | Render state, capture user input, dispatch actions |
| **State** | `hooks/use-game-reducer.ts` | Reducer + history stack |
| **Domain** | `lib/` | Types, reducer logic, algorithms (pure functions) |
| **Persistence** | `hooks/use-game-storage.ts` | AsyncStorage read/write |
| **Assets** | `assets/` | Audio, translations, images |

### Data Flow

```
User Action (tap button)
    → dispatch({ type: 'ACTION_NAME', ...payload })
    → gameReducer(currentState, action) → newState
        → (may call: assignRoles, checkWinCondition, applyLinkedDeath)
    → React re-renders phase component with new state
    → (optional) audio plays, sound effects trigger
    → (optional) state saved to AsyncStorage
```

### Navigation

No `react-navigation` stack. Single screen with conditional rendering:

```tsx
function renderPhase() {
  switch (state.phase) {
    case 'SETUP': return <SetupPhase state={state} dispatch={dispatch} t={t} />;
    // ... each phase gets state, dispatch, and t (translation function)
  }
}
```

Sub-phases within a component use local `useState`:

```tsx
// night-kill-phase.tsx
type SubPhase = 'NARRATION' | 'SELECT_VICTIM' | 'ANNOUNCEMENT';
const [subPhase, setSubPhase] = useState<SubPhase>('NARRATION');
```

### Dependency Injection

None needed — the app has no services, no DI container. Hooks provide all dependencies:

```tsx
const [state, dispatch, canGoBack, goBack] = useGameReducer();
const { loadPlayerNames, loadSettings, savePlayerNames, saveSettings } = useGameStorage();
const t = useMessages(state.settings.language);
```

For new apps with services (API clients, analytics), add a `services/` folder and pass via React Context or hook composition.

---

## 4. State Management & Concurrency

### State Storage

Single `useReducer` wrapped with a history hook:

```tsx
// hooks/use-game-reducer.ts
export function useGameReducer() {
  const [state, rawDispatch] = useReducer(gameReducer, INITIAL_STATE);
  const historyRef = useRef<GameState[]>([]);

  const dispatch = useCallback((action: GameAction) => {
    if (!SKIP_HISTORY.has(action.type)) {
      historyRef.current = [...historyRef.current.slice(-(MAX_HISTORY - 1)), state];
    }
    rawDispatch(action);
  }, [state]);

  const goBack = useCallback(() => {
    const previous = historyRef.current.pop()!;
    rawDispatch({ type: 'RESTORE_STATE', state: previous });
  }, []);

  return [state, dispatch, canGoBack, goBack] as const;
}
```

**Rules:**
- MAX_HISTORY = 20 (prevent memory bloat)
- Setup actions (ADD_PLAYER, REMOVE_PLAYER, etc.) skip history — no undo for typing
- Game-advancing actions automatically snapshot before executing
- `RESTORE_STATE` is the only way to go back

### Async Patterns

- **Audio playback:** Promise-based with `onPlaybackStatusUpdate` callback
- **Storage:** `async/await` with silent `try/catch`
- **No network calls** — but for new apps, use the same async pattern

### Threading Rules

- All state updates happen synchronously in the reducer
- Audio is the only async operation — managed via refs to prevent leaks
- Cleanup on unmount via `useEffect` return

```tsx
// Pattern for async resources
const soundRef = useRef<Audio.Sound | null>(null);

useEffect(() => {
  return () => {
    soundRef.current?.unloadAsync();
    soundRef.current = null;
  };
}, []);
```

---

## 5. Networking & Data Layer

### Networking

**Not present.** The app is fully offline. For new apps needing network:

```tsx
// Recommended: services/api-client.ts
export async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) throw new ApiError(response.status, await response.text());
  return response.json();
}
```

### Persistence

AsyncStorage with two keys:

```tsx
// hooks/use-game-storage.ts
const PLAYERS_KEY = 'palermo_lastPlayers';   // string[]
const SETTINGS_KEY = 'palermo_lastSettings'; // GameSettings

// Save
await AsyncStorage.setItem(key, JSON.stringify(data));

// Load with schema evolution
const loaded = data ? JSON.parse(data) : null;
return { ...DEFAULT_SETTINGS, ...(loaded ?? {}) };  // merge with defaults
```

**Patterns:**
- Silent `try/catch` on all storage operations — never crash on persistence failure
- Merge loaded data with defaults to handle schema changes across app versions
- Prefix all keys with app name to avoid collisions

### Error Handling

Graceful degradation everywhere. No error boundaries, no error screens:

```tsx
// Audio fails → silent, timed fallback handles it
try {
  const { sound } = await Audio.Sound.createAsync(source);
  await sound.playAsync();
} catch {
  // Caller falls back to setTimeout-based timing
}

// Storage fails → return defaults
try {
  return JSON.parse(await AsyncStorage.getItem(key)) ?? [];
} catch {
  return [];
}
```

For new apps with network: add error types, user-facing messages, and retry logic.

---

## 6. UI System / Design System

### Color Tokens

```tsx
const Palermo = {
  background:      '#0B0E14',          // Primary dark
  backgroundLight: '#131820',          // Elevated dark
  card:            '#1A1F2B',          // Card/container
  danger:          '#B91C1C',          // Destructive, killer faction
  dangerMuted:     '#7F1D1D',          // Muted red
  accent:          '#0EA5A4',          // Interactive, good faction
  accentMuted:     '#0D6B6B',          // Muted teal
  text:            '#E5E7EB',          // Primary text
  textMuted:       '#9CA3AF',          // Secondary text
  textDead:        '#4B5563',          // Disabled/dead text
  border:          '#2A2F3A',          // Borders
  overlay:         'rgba(0,0,0,0.7)',  // Modal backdrop
};
```

**Usage pattern:** Always reference tokens, never hardcode hex values:

```tsx
color: Palermo.text          // not '#E5E7EB'
backgroundColor: Palermo.card // not '#1A1F2B'
```

### Typography Scale

| Level | Size | Weight | Font | Usage |
|-------|------|--------|------|-------|
| Display | 42-44px | 700 | Georgia | Winner text, app title |
| H1 | 36-38px | 700 | Georgia | Player name reveal |
| H2 | 28px | 600-700 | Georgia | Phase titles |
| H3 | 24px | 700 | System | Subheadings |
| Body | 18px | 500 | System | Player names, standard text |
| Label | 14-16px | 600 | System | Section labels, descriptions |
| Small | 12-14px | 500 | System | Metadata, badges |
| Tiny | 11px | 400 | System | Minimum info |

**Font families:**

```tsx
const PalermoFonts = Platform.select({
  ios: { title: 'Georgia', body: undefined },       // undefined = system
  default: { title: 'serif', body: undefined },
});
```

### Spacing Scale

Values used consistently across components:

```
6   — tight list gaps
8   — list item gaps, small padding
10  — row gaps, medium padding
12  — button gaps
14  — card inner padding (vertical)
16  — card inner padding (horizontal), section gaps
20  — major section gaps
24  — container padding, large gaps
32  — centered content padding
40  — button-to-content margin
48  — top offset (clear Dynamic Island)
60  — screen top padding (main screens)
80  — extra top padding (end screen)
```

### Border Radius

```
6-8px   — inputs, checkboxes, small controls
10px    — cards, rows, standard buttons
12px    — primary action buttons
16px    — modal cards
18px    — circular buttons (36px wide / 2)
```

### Component Inventory

**Button** — Primary action component:

```tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'secondary';
}
// Height: 56px, borderRadius: 12px, haptic feedback on press
// Pressed: opacity 0.85, scale 0.98
// Disabled: opacity 0.4
```

**FadeView** — Animated visibility wrapper:

```tsx
interface FadeViewProps {
  visible: boolean;
  duration?: number;  // default 500ms
  children: React.ReactNode;
}
// Uses react-native-reanimated, Easing.inOut(Easing.ease)
```

**BackButton** — Navigation back:

```tsx
interface BackButtonProps { onPress: () => void; }
// Position: absolute, top: 48, left: 16
// Size: 36x36, circular, chevron icon
// No background by default, background on press only
```

**PlayerList** — Reusable player display:

```tsx
interface PlayerListProps {
  players: Player[];
  t: TFunction;
  showRoles?: boolean;
  selectable?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  aliveOnly?: boolean;
}
```

### Interactive States

```tsx
// Pressed
style={({ pressed }) => [styles.button, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}

// Disabled
style={[styles.button, disabled && { opacity: 0.4 }]}

// Selected (card/row)
style={[styles.row, selected && { borderColor: Palermo.accent, backgroundColor: Palermo.backgroundLight }]}

// Dead/Inactive
style={{ opacity: 0.4, textDecorationLine: 'strikethrough' }}
```

### Screen Layout Pattern

Every main phase follows:

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,       // Clear status bar + Dynamic Island
  },
  // ... content
  footer: {
    gap: 10,
    paddingTop: 16,
  },
});
```

Centered content screens (narration, reveals):

```tsx
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 32,
}
```

### Modal Pattern

```tsx
<Modal transparent animationType="fade">
  <Pressable style={styles.overlay} onPress={onClose}>
    <View style={styles.card}>
      {/* content */}
    </View>
  </Pressable>
</Modal>

overlay: { flex: 1, backgroundColor: Palermo.overlay, justifyContent: 'center', alignItems: 'center' }
card: { maxWidth: 360, backgroundColor: Palermo.card, borderRadius: 16, padding: 24 }
```

### Loading / Empty / Error States

**Not present** — the app is offline and synchronous. For new apps:

- **Loading:** Skeleton views or centered ActivityIndicator
- **Empty:** Centered text + illustration + CTA button
- **Error:** Banner at top or centered message with retry button

### Animation Guidelines

- Use `react-native-reanimated` for layout animations
- `FadeView` with 400-500ms for content transitions
- `Easing.inOut(Easing.ease)` for smooth curves
- Haptic feedback (`expo-haptics`, Light impact) on button press
- No spring animations — keep it simple and cinematic

### Accessibility

**Gaps to fill for new apps:**
- Add `accessibilityLabel` to all interactive elements
- Add `accessibilityRole` to buttons and inputs
- Test with VoiceOver
- Ensure minimum 44x44pt touch targets (current: 36x36 on some controls — add `hitSlop`)
- Ensure 4.5:1 contrast ratio on all text (current palette passes for primary text)

### Localization

JSON-based, fully typed:

```tsx
// lib/messages.ts
export function t(language: Language, key: MessageKey, params?: Record<string, string | number>): string {
  let text = messages[language]?.[key] ?? messages.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params))
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }
  return text;
}

// Usage in components
const t = useMessages(state.settings.language);
t('vote.votes', { count: 5 })  // "5 votes"
```

**Rules:**
- Never hardcode user-facing strings — always use message keys
- Add keys to BOTH language files simultaneously
- Use `{param}` syntax for dynamic values
- Singular/plural: separate keys (`vote.votes` vs `vote.votesSingular`)

### Dark Mode

Dark-only design. The `Palermo` color palette is dark-first. If you need light mode:

- Create `PalermoLight` token set
- Use `useColorScheme()` hook to select
- Apply via a theme context or conditional token map

---

## 7. UX Principles & Product Patterns

### What Makes It Smooth

- **No loading states** — everything is local and instant
- **Audio-driven pacing** — narration auto-advances when audio finishes + 2s pause
- **Haptic feedback** — light impact on every button press
- **Fade transitions** — 400-500ms between narration steps, no jarring cuts
- **Back button everywhere** — undo any mistake, history stack of 20 states
- **Auto-save setup** — player names and settings persist across launches
- **Minimal taps** — comma-separated bulk player add, one-tap voting

### Settings Pattern

Modal overlay with switches and segmented controls:

```tsx
<Modal transparent animationType="fade">
  <Overlay>
    <Card>
      <Header title + close button />
      <Toggle rows with description text />
      <Divider />
      <Language selector (chip buttons) />
    </Card>
  </Overlay>
</Modal>
```

### Onboarding

**Not present.** The setup screen IS the onboarding — add players, configure roles, start. For new apps needing onboarding, add a `components/onboarding/` folder with step components and track completion in AsyncStorage.

### Notifications / Deep Links / Widgets

**Not present.** Offline single-session game. For new apps, handle via `expo-notifications`, `expo-linking`, and Expo Widget APIs.

### Monetization

**Not present.** Free app. For new apps: add paywall component in `components/ui/paywall.tsx`, gate features via a `usePremium()` hook.

---

## 8. Code Quality Standards

### Lint & Format

```js
// eslint.config.js — uses Expo's ESLint config
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
module.exports = defineConfig([...expoConfig]);
```

**Key rules enforced:**
- TypeScript strict mode
- React Compiler enabled (`reactCompiler: true` in app.json)
- No unused variables
- Consistent import ordering (via Expo preset)

### Testing

**Not present.** No test files exist. For new apps:

- **Unit tests:** `lib/` functions with Jest (`game-reducer.test.ts`, `win-conditions.test.ts`)
- **Component tests:** `@testing-library/react-native` for phase components
- **Test naming:** `describe('gameReducer') > it('should eliminate player and check win condition')`
- **Mocking:** Mock `expo-av` and `AsyncStorage` in test setup

Recommended test structure:

```
__tests__/
├── lib/
│   ├── game-reducer.test.ts
│   ├── role-assignment.test.ts
│   └── win-conditions.test.ts
└── components/
    └── game/
        └── voting-phase.test.tsx
```

### Logging

**Not present.** For new apps: use `console.warn` for development, strip in production via babel plugin. Never log PII (player names, settings).

### Analytics

**Not present.** For new apps: create `lib/analytics.ts` with event naming convention:

```
screen_viewed, button_tapped, game_started, game_ended
```

### Crash Reporting

**Not present.** For new apps: use `expo-updates` + Sentry or Bugsnag.

---

## 9. Performance & Reliability Practices

### Startup

- Root layout renders immediately (no splash delay)
- AsyncStorage load is non-blocking — UI renders with empty state, then hydrates
- Audio files are bundled (via `require()`), not downloaded

### Image & Audio Loading

- All assets bundled at build time — no runtime fetching
- Audio loaded on-demand per step (not preloaded) to save memory
- Sound instances cleaned up after each playback

### Offline Behavior

Fully offline by design. No network indicator, no retry logic needed.

### Memory Management

- Audio `Sound` instances unloaded on unmount and before loading next
- History stack capped at 20 entries
- FlatList used for long lists (not ScrollView with map)

### Defensive Patterns

```tsx
// Always provide fallback values
const count = votes[item.id] || 0;
const text = messages[language]?.[key] ?? messages.en[key] ?? key;

// Always clean up async resources
useEffect(() => {
  return () => { soundRef.current?.unloadAsync(); };
}, []);

// Guard against stale state in async callbacks
const cancelledRef = useRef(false);
useEffect(() => {
  cancelledRef.current = false;
  return () => { cancelledRef.current = true; };
}, [step]);
```

---

## 10. Security & Privacy Checklist

- [x] No user accounts — no authentication surface
- [x] No network requests — no data exfiltration risk
- [x] No PII collected — player names stored locally only
- [x] AsyncStorage only (not Keychain) — appropriate for non-sensitive game data
- [x] `ITSAppUsesNonExemptEncryption: false` declared in Info.plist
- [x] App Privacy declaration: "No data collected"
- [ ] For new apps with auth: use Keychain for tokens, HTTPS only, certificate pinning

---

## 11. Release Engineering

### Build Configurations

```json
// eas.json
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal" },
    "production": {}
  }
}
```

### Versioning Strategy

In `app.json`:

- `version`: Semantic version shown to users (`1.1.0`)
- `buildNumber` (iOS) / `versionCode` (Android): Increment per build submission

**Rules:**
- Bump `version` for every App Store release (even minor changes)
- Reset `buildNumber` to `"1"` when bumping `version`
- Use `buildNumber` to distinguish rejected resubmissions of the same version

### Build & Submit Commands

```bash
# Development
npx expo start

# Production build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --latest
```

### App Store Submission Checklist

- [ ] Bump `version` and reset `buildNumber` in `app.json`
- [ ] Run `eas build --platform ios --profile production`
- [ ] Run `eas submit --platform ios --latest`
- [ ] In App Store Connect: create new version, select build
- [ ] Upload screenshots (iPhone 6.5" + iPad 13") — they DON'T carry over between versions
- [ ] Fill in "What's New"
- [ ] Verify App Privacy section
- [ ] Verify age rating
- [ ] Click "Add for Review"

**Common rejection reasons to avoid:**
- Don't declare `UIBackgroundModes` unless you actually use background audio
- Don't include `NSMicrophoneUsageDescription` unless you record audio
- Don't forget iPad screenshots if `supportsTablet: true`

---

## 12. How to Build a New App Using This Playbook

### Step 1: Scaffold

```bash
npx create-expo-app@latest my-app
cd my-app
```

### Step 2: Set Up Structure

```bash
mkdir -p components/ui components/feature hooks lib constants assets/messages
```

### Step 3: Create Theme

Copy the `constants/theme.ts` pattern — define your color tokens and font families. Everything references tokens.

### Step 4: Create i18n

Create `assets/messages/en.json`, `lib/messages.ts`, and `hooks/use-messages.ts`. Type your message keys.

### Step 5: Define State

Write your types in `lib/types.ts`, your reducer in `lib/reducer.ts`, and wrap with `hooks/use-app-reducer.ts` (with history if needed).

### Step 6: Build UI Primitives

Create `Button`, `FadeView`, and any other reusable components in `components/ui/`.

### Step 7: Build First Feature

Create your first feature component in `components/feature/`. Wire it into the screen via `app/index.tsx`.

### Step 8: Add Persistence

Create `hooks/use-storage.ts` with AsyncStorage. Load on mount, save on key state transitions.

### Step 9: Configure EAS

```bash
eas init
eas build:configure
```

### Definition of Done (per feature)

- [ ] Types added to `lib/types.ts`
- [ ] Reducer cases handle all new actions
- [ ] Component renders correctly in all states
- [ ] i18n keys added to ALL language files
- [ ] Styles use design tokens only
- [ ] Interactive elements have haptic feedback
- [ ] Async resources are cleaned up on unmount
- [ ] Works on both iPhone and iPad (if `supportsTablet`)

---

## 13. Templates

### New Feature Component

```tsx
// components/feature/my-feature.tsx
import { StyleSheet, Text, View } from 'react-native';
import { Palermo } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { AppState, AppAction } from '@/lib/types';
import { TFunction } from '@/hooks/use-messages';

interface MyFeatureProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  t: TFunction;
}

export function MyFeature({ state, dispatch, t }: MyFeatureProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('myFeature.title')}</Text>
      <View style={styles.footer}>
        <Button title={t('common.continue')} onPress={() => dispatch({ type: 'NEXT' })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60 },
  title: { color: Palermo.text, fontSize: 28, fontWeight: '700', textAlign: 'center' },
  footer: { gap: 10, paddingTop: 16 },
});
```

### Reducer Action Template

```tsx
// In lib/reducer.ts
case 'MY_ACTION': {
  const updated = /* compute new state */;
  const winner = checkEndCondition(updated);
  if (winner) return { ...state, ...updated, phase: 'END', winner };
  return { ...state, ...updated, phase: 'NEXT_PHASE' };
}
```

### Hook with Async Resource

```tsx
// hooks/use-my-resource.ts
import { useCallback, useEffect, useRef } from 'react';

export function useMyResource() {
  const resourceRef = useRef<SomeResource | null>(null);

  const cleanup = useCallback(async () => {
    if (resourceRef.current) {
      await resourceRef.current.release();
      resourceRef.current = null;
    }
  }, []);

  const use = useCallback(async (input: string) => {
    await cleanup();
    try {
      resourceRef.current = await SomeResource.create(input);
      await resourceRef.current.start();
    } catch {
      // Silent fallback
    }
  }, [cleanup]);

  useEffect(() => () => { cleanup(); }, [cleanup]);

  return { use, cleanup };
}
```

### Storage Hook Template

```tsx
// hooks/use-storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

const KEY = 'myapp_data';

export function useStorage<T>(defaultValue: T) {
  const save = useCallback(async (data: T) => {
    try { await AsyncStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }, []);

  const load = useCallback(async (): Promise<T> => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      return raw ? { ...defaultValue, ...JSON.parse(raw) } : defaultValue;
    } catch { return defaultValue; }
  }, []);

  return { save, load };
}
```

### PR Checklist

```markdown
## PR Checklist
- [ ] Types updated in `lib/types.ts`
- [ ] Reducer handles new actions
- [ ] i18n keys added to all language files
- [ ] Styles use theme tokens only
- [ ] No hardcoded strings in UI
- [ ] Async resources cleaned up on unmount
- [ ] Tested on iPhone and iPad simulator
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] ESLint passes (`npx expo lint`)
```

### Code Review Checklist

```markdown
## Review Checklist
- [ ] Business logic is in `lib/`, not in components
- [ ] No direct color/size values — uses design tokens
- [ ] All user-facing strings go through `t()`
- [ ] Reducer actions are typed in `GameAction` union
- [ ] StyleSheet.create() used (not inline styles)
- [ ] Async resources have cleanup in useEffect return
- [ ] No silent swallowing of important errors (storage errors are fine)
- [ ] FlatList used for dynamic lists (not ScrollView + map)
```
