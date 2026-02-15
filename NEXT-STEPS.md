# Palermo — Next Steps

## TODO

### 1. Add Logo
- Design/source a Palermo logo (dark theme, cinematic feel)
- Add logo image to `assets/images/logo.png` (include @2x and @3x variants)
- Display on the Setup screen in place of or above the title text
- Use on the splash screen (`app.json` splash config)

### 2. Add Audio Narration Files (Bilingual)

Record or source voice narration for each line in **both Greek and English**.

#### Directory Structure
```
assets/
  audio/
    el/          ← Greek narration
      night-falls.mp3
      killers-wake.mp3
      ...
    en/          ← English narration
      night-falls.mp3
      killers-wake.mp3
      ...
```

#### Format
- **MP3** — best compatibility across iOS/Android, small file size, supported natively by `expo-av`
- Sample rate: 44.1kHz
- Channels: mono (sufficient for voice narration, halves file size)
- Bitrate: 128kbps+
- Keep each file short (3–8 seconds)

#### Required Audio Files (same filenames in both `el/` and `en/`)

| File | English Text | Greek Text |
|---|---|---|
| `night-falls.mp3` | "Night falls on Palermo. Everyone close your eyes." | "Νύχτα πέφτει στο Παλέρμο. Όλοι κλείστε τα μάτια." |
| `killers-wake.mp3` | "Hidden Killer and Revealed Killer, open your eyes and meet each other." | "Κρυφέ και Φανερέ Δολοφόνε, ανοίξτε τα μάτια σας και γνωριστείτε." |
| `close-eyes.mp3` | "Close your eyes." | "Κλείστε τα μάτια." |
| `detective-wake.mp3` | "Revealed Killer, raise your hand. Detective, open your eyes." | "Φανερέ Δολοφόνε, σήκωσε το χέρι σου. Αστυνομικέ, άνοιξε τα μάτια σου." |
| `everyone-close-eyes.mp3` | "Everyone close your eyes." | "Όλοι κλείστε τα μάτια." |
| `lovers-wake.mp3` | "Lovers, open your eyes and find each other." | "Ερωτευμένοι, ανοίξτε τα μάτια σας και γνωριστείτε." |
| `dawn-breaks.mp3` | "Dawn breaks. Everyone open your eyes." | "Ξημέρωσε. Όλοι ανοίξτε τα μάτια." |
| `night-again.mp3` | "Night falls again. Everyone close your eyes." | "Νύχτα πέφτει ξανά. Όλοι κλείστε τα μάτια." |
| `killers-choose.mp3` | "Killers, whisper your target to the messenger." | "Δολοφόνοι, ψιθυρίστε τον στόχο σας στον αγγελιοφόρο." |
| `doctor-wake.mp3` | "Doctor, open your eyes. Choose someone to save." | "Γιατρέ, άνοιξε τα μάτια σου. Διάλεξε κάποιον να σώσεις." |
| `doctor-sleep.mp3` | "Doctor, close your eyes." | "Γιατρέ, κλείσε τα μάτια σου." |
| `informant-wake.mp3` | "Informant, open your eyes." | "Ρουφιάνε, άνοιξε τα μάτια σου." |
| `informant-sleep.mp3` | "Informant, close your eyes." | "Ρουφιάνε, κλείσε τα μάτια σου." |

#### Audio Recording Guidelines
- **Tone:** calm, low, cinematic — think narrator in a thriller
- **Pace:** slow and deliberate, with pauses between sentences
- **Environment:** quiet room, no echo, no background noise
- **Voice:** consistent narrator voice across all clips (same person per language)
- **No background music** in the voice clips (can layer ambient audio separately later)
- **Normalize** audio levels across all clips so volume is consistent

#### Integration Steps
- `expo-av` is already installed
- Create a narration audio loader in `lib/narration.ts` that maps each key to the correct language folder:
  ```ts
  // Example: load audio based on language
  const audioFile = language === 'el'
    ? require('@/assets/audio/el/night-falls.mp3')
    : require('@/assets/audio/en/night-falls.mp3');
  ```
- Update `night-intro-phase.tsx` and `night-kill-phase.tsx` to use `Audio.Sound.createAsync()` + `playAsync()` instead of text timers
- Lock UI buttons while audio is playing
- Show narration text on screen in sync with audio (already displayed)
- Fall back to timed text display if audio file fails to load
- Clean up audio resources on phase change (`sound.unloadAsync()`)

### 3. Skip Discussion Phase — Go Straight to Voting
- Remove the "Start discussion" button and "Discuss who to eliminate" text
- Remove the discussion timer completely
- After "Ξημέρωσε. Ανοίξτε τα μάτια" (dawn narration), transition directly to the Voting phase
- The real discussion happens naturally in person — the app doesn't need to manage it
- Update `day-discussion-phase.tsx` or remove it and go from `NIGHT_INTRO` / `DAY_DISCUSSION` straight to `VOTING` in the game reducer

### 4. Add Atmospheric Audio Effects
- Add mysterious/suspenseful sound effects to enhance the game's cinematic feel
- Examples:
  - Eerie ambient drone during night phases
  - Suspenseful sting when a kill is revealed
  - Dramatic tension sound during voting
  - Soft chime or reveal sound during role assignment
  - Victory/defeat sound at game end
- Source royalty-free sound effects or create original ones
- Keep effects short (1-5 seconds) and subtle — they should add atmosphere, not distract
- Store in `assets/audio/sfx/` (language-independent)
- Play via `expo-av` alongside narration where appropriate

### 5. Fix Role Shuffling — Killers Should Not Always Be First Two Players
- Currently the killers are always assigned to the first two players in the list
- Role assignment must be properly randomized/shuffled
- Update the role assignment logic in `lib/role-assignment.ts` to shuffle players before assigning roles
- Ensure every game has a truly random distribution of roles regardless of player order
- This is a critical gameplay bug — predictable roles break the social deduction mechanic
