# AGENTS.md

Instructions for coding agents working on this repo. Humans may find them useful too. Read [AI_POLICY.md](AI_POLICY.md) before you open a pull request.

## What this is

Palermo is a single-device, offline party game (the Greek version of Mafia) built with Expo SDK 54, React Native 0.81 and Expo Router. The app is the narrator: it hands out roles, narrates the night with recorded audio in Greek and English, and tracks who is alive. The full rules are in [PRODUCT.md](PRODUCT.md). The conventions are in [docs/app_playbook.md](docs/app_playbook.md).

## Commands

```bash
npm install
npx expo start        # run the app (Expo Go, iOS simulator or Android emulator)
npm test              # Jest unit tests in __tests__/
npm run lint          # ESLint (expo lint)
npx tsc --noEmit      # type check
```

A change is done when tests, lint and the type check all pass. If you changed something a player sees, it also needs a manual run of the game in the app.

## Where things live

- `lib/` holds all game rules as pure TypeScript with no React: `game-types.ts` (types, roles, settings, minimum players), `game-reducer.ts` (every state change), `role-assignment.ts`, `win-conditions.ts`, `narration.ts`, `messages.ts`.
- `components/game/` has one component per phase: setup, role reveal, night intro, voting, night kill, end.
- `app/index.tsx` switches on `state.phase` and renders the matching component.
- `hooks/use-game-reducer.ts` wraps the reducer and keeps an undo history for the back button.
- `assets/messages/en.json` and `el.json` hold every UI string. `assets/audio/en/` and `el/` hold the narration clips.
- `__tests__/` has unit tests for `lib/`. `__tests__/helpers.ts` builds players with fixed roles.

## Rules

- Game logic goes in `lib/` and changes state through reducer actions. Components dispatch actions and render. They don't decide who wins or who dies.
- Any rule change in `lib/` needs a test in `__tests__/`.
- Every user-facing string goes in both `en.json` and `el.json`. Greek is the default language, so never ship English only. If you can't write good Greek, say so in the pull request.
- The app stays offline and collects no data. Don't add analytics, crash reporting, ads, accounts or network calls. The App Store privacy label depends on this.
- Don't add a dependency unless the change can't be done without it, and explain why in the pull request.
- Follow the existing style: kebab-case file names, named exports, the `@/` import alias, `StyleSheet.create()` at the bottom of the file, colors from `constants/theme.ts`.
- Keep the diff to what the task needs. Don't reformat, rename or "clean up" unrelated files.
- Don't edit `app.json`, `eas.json` or the version and build numbers. The maintainer handles releases.

## Gotchas

- `checkWinCondition` in `lib/win-conditions.ts` finds killers by the role names `HIDDEN_KILLER` and `REVEALED_KILLER`, not by `ROLE_FACTIONS`. A new killer-side role has to be added there too.
- The Lovers are a flag (`isLover`) on top of a normal role, not a `Role`. The lovers win check runs before the killers check.
- Saved settings are merged with `DEFAULT_SETTINGS` on load (`hooks/use-game-storage.ts`), so a new setting needs a default value there.
- Narration clips are loaded with static `require()` calls in `lib/narration.ts`. Metro can't resolve dynamic paths, so every new clip needs a line in both language maps.

## Skills

`.claude/skills/add-role/` is a step-by-step guide for adding an optional role (like the Doctor). Claude Code loads it automatically. Other agents can read the `SKILL.md` directly.
