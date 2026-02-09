# Palermo — Product Document

## Overview

**Palermo** is a single-device, offline social deduction game app. It serves as a digital facilitator (narrator) for a physical party game where players sit together in the same room. The app replaces the human narrator with audio-driven narration, role assignment, and game state tracking — while keeping the core experience rooted in face-to-face interaction, psychology, and deception.

**Players:** 5+
**Device:** One shared phone/tablet
**Network:** None required (fully offline)
**Platform:** Mobile (React Native / Expo)

---

## Game Concept

Players are secretly divided into two factions: **Good** and **Killers**. The game alternates between **Night** and **Day** phases until one side wins.

### Objectives

- **Killers:** Eliminate all good players.
- **Good players:** Identify and eliminate both killers.

---

## Roles

### Killer Faction

#### Hidden Killer
- Exactly **one** per game.
- Coordinates with the Revealed Killer each night to choose a victim.
- Identity is **unknown** to all good players, including the Detective.
- The primary threat — must stay hidden to win.

#### Revealed Killer
- Exactly **one** per game.
- Knows and is known by the Hidden Killer.
- Participates in the nightly kill decision.
- No special ability beyond coordination and misdirection.
- Identity is **unknown to Citizens** but **known to the Detective from the start**.

### Good Faction

#### Citizen
- No special ability.
- Knows no one's role.
- Participates in discussion and voting.

#### Detective
- Knows the identity of the **Revealed Killer** from the start.
- Does **not** know who the Hidden Killer is.
- Does **not** investigate other players during the game (unless house rules allow it).
- Goal: protect their information, subtly guide votes, and help identify the Hidden Killer.

#### Informant (optional)
- Receives **limited information** as defined by the group's house rules.
- Never learns directly who the killers are.

#### Lovers (optional)
- Two players linked together.
- If one dies, **the other dies too**.
- Can belong to either faction.
- Often have a **separate win condition** (survive together until the end).

#### Doctor (optional)
- Each night, chooses **one player to save**.
- If that player is the killers' target, the kill fails.

---

## Game Flow

### 1. Setup / Lobby

- One device placed in the center of the group.
- The app acts as the narrator.
- Screen shows:
  - Player name input (add/remove players).
  - A small **settings gear icon** (top-right corner).
- Press **Start Game** to begin.

#### Settings Panel (via gear icon)

Tapping the gear icon opens an overlay/modal with toggles for optional roles:

| Role | Toggle | Default | Min. Players Note |
|---|---|---|---|
| Doctor | ON / OFF | OFF | Recommended 6+ players |
| Informant | ON / OFF | OFF | Recommended 7+ players |
| Lovers | ON / OFF | OFF | Recommended 7+ players |

- Each toggle has the role name + a one-line description.
- The panel is minimal — no tabs, no nested menus.
- Close by tapping outside or a small X button.
- The app validates that the player count supports the selected roles before starting. If not enough players, it shows a brief warning and prevents start.

#### Role Distribution Logic

The app auto-assigns roles based on player count and enabled optional roles:

| Role | Count | Required |
|---|---|---|
| Hidden Killer | 1 | Always |
| Revealed Killer | 1 | Always |
| Detective | 1 | Always |
| Doctor | 0 or 1 | If enabled in settings |
| Informant | 0 or 1 | If enabled in settings |
| Lovers | 0 or 2 | If enabled in settings (assigned to 2 random players who also keep their primary role) |
| Citizen | Remaining | Always (fills the rest) |

Lovers is a **secondary role** — two players are marked as Lovers in addition to whatever primary role they received. This means a Lover can also be a Killer, Detective, Doctor, etc.

### 2. Role Assignment (Pass-the-Phone)

For each player:
1. App displays: *"Pass the device to: [Name]"*
2. Player taps **See Your Role**.
3. Player sees their role + a brief instruction.
4. Player taps **Ready** — next player's turn.

All players learn their roles one by one in private.

### 3. Night — Introduction Phase

#### 3.1 Global Narration
- *"Night falls on Palermo. Everyone close your eyes."*

#### 3.2 Killer Introduction
- *"Hidden Killer and Revealed Killer, open your eyes and meet each other."*
- Brief timer.
- *"Close your eyes."*

#### 3.3 Detective Identification
- *"Revealed Killer, raise your hand. Detective, open your eyes."*
- Brief timer.
- *"Everyone close your eyes."*

#### 3.4 Lovers Introduction (if enabled)
- *"Lovers, open your eyes and find each other."*
- Brief timer.
- *"Close your eyes."*

### 4. First Day — Discussion & Voting

1. *"Dawn breaks. Everyone open your eyes."*
2. Free discussion among players (no app input needed).
3. App runs a **discussion timer** (e.g. 3 minutes).
4. App prompts: *"Vote on who to eliminate."*
5. Players vote **verbally or by raising hands** (physical, not in-app).
6. The group decides who received the most votes.
7. The eliminated player is selected in the app.
8. The eliminated player's role is **NOT revealed**.

### 5. Night — Kill Phase (Offline Action)

1. *"Night falls again. Everyone close your eyes."*
2. The killers **whisper to each other** and choose their next victim.
3. They tell the victim's name to the **previously eliminated player** (who acts as a messenger, not a participant).
4. No selection is made inside the app.

#### Doctor's Turn (if enabled and alive)
- *"Doctor, open your eyes. Choose someone to save."*
- The Doctor silently points at or signals a player.
- The messenger takes note.
- *"Doctor, close your eyes."*
- If the Doctor's choice matches the killers' target, the kill is blocked and the app announces a failed kill in the morning.

#### Informant's Turn (if enabled and alive)
- *"Informant, open your eyes."*
- The Informant receives a limited piece of information (defined by house rules — e.g., the messenger nods/shakes head about a specific player).
- *"Informant, close your eyes."*

### 6. Morning — Victim Announcement

1. *"Dawn breaks."*
2. The eliminated player **announces aloud** who was killed during the night (or that the kill was blocked, if the Doctor saved them).
3. The killed player is marked as **dead** in the app.
4. The dead player **may not speak again**.
5. **Lovers check:** If the dead player is a Lover, their partner **also dies immediately** and is marked dead in the app.

### 7. Cycle Repeats

```
Discussion → Voting → Elimination → Night → Kill (via messenger) → Announcement → ...
```

### 8. Endgame

The app checks win conditions after each elimination:

| Condition | Result |
|---|---|
| Both killers are dead | **Good wins** |
| Killers >= Good players alive | **Killers win** |
| Lovers are the last alive (if active) | **Lovers win** |

#### End Screen
- Display the winner.
- Reveal all player roles.
- Button: **New Round** (keeps player names, resets everything else).

---

## Win Conditions

- **Killers win** when killers are equal to or outnumber the good players.
- **Good wins** when both the Hidden Killer and the Revealed Killer are eliminated.
- **Lovers win** (if enabled) when they are the last players standing.

---

## Technical Architecture

### State Management

Single `useReducer` — no Redux, no Context, no classes.

```
Phase = SETUP | ROLE_REVEAL | NIGHT_INTRO | DAY_DISCUSSION | VOTING | NIGHT_KILL | END
```

### Data Model

```
Player = {
  name: string
  role: Role
  alive: boolean
  isLover: boolean
}

GameSettings = {
  doctorEnabled: boolean
  informantEnabled: boolean
  loversEnabled: boolean
}
```

No history, no event logs, no round tracking. Overwrite state directly.

### Persistence

Store player names and role settings via `AsyncStorage`:

```
{
  lastPlayers: string[]
  lastSettings: GameSettings
}
```

Save on game start. On relaunch mid-game:
> "Start a new game with the same names?"

Do **not** persist: roles, alive status, current phase, or any game state.

### New Round Flow

On the end screen, **New Round** resets:
- Roles (re-randomized)
- Alive flags (all true)
- Phase (back to SETUP or ROLE_REVEAL)

Player names are **kept**.

### Audio

- Sequential playback only — one narration at a time.
- `await playAsync()` before proceeding.
- No overlapping audio.
- Clean up timers on every phase change.

### Performance

No memory concerns if:
- No manual audio buffer storage.
- No arrays accumulating across rounds.
- No `setInterval` without cleanup.

---

## UI / Design System

### Core Philosophy

The app **does not play the game** — it facilitates the game happening in the room. Therefore:
- Few buttons.
- Large text.
- High contrast.
- Clean transitions.

### Color Palette

| Token | Value | Usage |
|---|---|---|
| Background | `#0B0E14` | Primary dark background |
| Danger / Killer accent | `#B91C1C` | Night phase, kill moments |
| Truth / Detective accent | `#0EA5A4` | Day phase, reveals |
| Text | `#E5E7EB` | All body and title text |

Avoid: pure black, neon colors.

### Typography

- **Titles:** Serif or cinematic — Playfair Display, Cinzel, or Libre Baskerville.
- **Body / Buttons:** Clean sans-serif — Inter, SF Pro, or Roboto.
- Titles are large and few.
- One sentence max per screen.
- Uppercase only for narrator moments.

### Layout

One-screen architecture. Conditional rendering per phase, not screen navigation.

```
[     PHASE TITLE     ]

      Main message
      (one sentence)

   [ PRIMARY ACTION ]
```

- One primary CTA per screen.
- Buttons >= 56px height, rounded but not pill-shaped.
- No swipe gestures, no small lists.
- Designed for: darkness, multiple viewing angles, 5–10 people around one device.

### Phase Visual Language

| Phase | Background | Accent | Transitions |
|---|---|---|---|
| Night | Dark | Red | Slow fade in |
| Day | Slightly lighter | White / Cyan | Sharper |

### Animations

**Use only:**
- Fade in / fade out
- Slow scale (1.0 → 1.03)
- Opacity transitions

**Never use:**
- Slide-ins
- Bounce
- Spring physics

Pacing is **slow and ritual-like**.

### Player List UI

- Names: large font, monochrome.
- Dead players: reduced opacity + strikethrough (or small skull icon).
- Roles are **never shown** in the main game UI.

### Audio + UI Sync

When narration plays:
- Lock all buttons.
- Display one sentence matching the audio.
- Subtle pulse effect on text.

Audio **drives** the UI, not the other way around.

### Iconography

- Minimal icons, outline style, monochrome.
- No emoji. No cartoon icons.

### End Screen

- Dark background.
- Large centered text: "GOOD WINS" or "KILLERS WIN".
- Followed by full role reveal (scroll or tap).

### Anti-Patterns (things that kill the vibe)

- Bright UI
- Too much text
- Gamey sound effects
- Confetti
- Tooltips

---

## Design Principles (TL;DR)

1. **Dark, cinematic, minimal.**
2. **One action per screen.**
3. **Audio over UI.**
4. **Big text, big buttons.**
5. **Slow, ritual-like transitions.**

---

## MVP Scope

### In (must have)

- Player name entry + persistence
- Settings gear icon with optional role toggles
- Role assignment (pass-the-phone)
- Core roles: Hidden Killer, Revealed Killer, Citizen, Detective
- Optional roles: Doctor, Informant, Lovers (toggled via settings)
- Auto role distribution based on player count + enabled roles
- Night intro phase with narration (including optional role phases)
- Day discussion with timer
- Voting phase (manual, mark eliminated player)
- Night kill phase (announcement-based, with Doctor save logic)
- Lovers linked-death mechanic
- Win condition checks (including Lovers win)
- End screen with role reveal
- New round with same players
- Audio narration for all phase transitions

### Out (not in MVP)

- In-app voting (voting stays physical/verbal)
- Multi-device / online play
- Player avatars or profile pictures
- Game history or statistics
- Localization (MVP is single-language)
- Onboarding tutorial
- Custom role creation

---

## Target Platform

- **Framework:** React Native with Expo
- **State:** Single `useReducer`
- **Storage:** `AsyncStorage` (player names only)
- **Audio:** Expo AV (sequential playback)
- **Navigation:** None (single screen, phase-based rendering)
- **Backend:** None (fully offline)
