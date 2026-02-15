# Palermo — Next Steps

## TODO

### 1. Add Audio Narration Files (Bilingual)

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
| `night-falls.mp3` | "A night falls on Palermo and everyone closes their eyes." | "Μία νύχτα πέφτει στο Παλέρμο και όλοι κλείνουν τα μάτια τους." |
| `killers-wake.mp3` | "The Hidden Killer and the Revealed Killer open their eyes to meet each other." | "Ο κρυφός και ο φανερός δολοφόνος ανοίγουν τα μάτια τους για να γνωριστούν." |
| `close-eyes.mp3` | "Everyone closes their eyes." | "Όλοι κλείνουν τα μάτια τους." |
| `detective-wake.mp3` | "The Revealed Killer raises their hand. The Detective opens their eyes and sees them." | "Ο φανερός δολοφόνος σηκώνει το χέρι του. Ο αστυνομικός ανοίγει τα μάτια του και τον βλέπει." |
| `everyone-close-eyes.mp3` | "Everyone closes their eyes." | "Όλοι κλείνουν τα μάτια τους." |
| `lovers-wake.mp3` | "The Lovers open their eyes and find each other." | "Οι ερωτευμένοι ανοίγουν τα μάτια τους και γνωρίζονται." |
| `dawn-breaks.mp3` | "The day dawns and everyone opens their eyes." | "Η ημέρα ξημερώνει και όλοι ανοίγουν τα μάτια τους." |
| `night-again.mp3` | "A night falls on Palermo again. Everyone closes their eyes." | "Μία νύχτα πέφτει στο Παλέρμο ξανά. Όλοι κλείνουν τα μάτια τους." |
| `killers-choose.mp3` | "The killers whisper their target to the messenger." | "Οι δολοφόνοι ψιθυρίζουν τον στόχο τους στον αγγελιοφόρο." |
| `doctor-wake.mp3` | "The Doctor opens their eyes and chooses who to save." | "Ο γιατρός ανοίγει τα μάτια του και διαλέγει ποιον θέλει να σώσει." |
| `doctor-sleep.mp3` | "The Doctor closes their eyes." | "Ο γιατρός κλείνει τα μάτια του." |
| `informant-wake.mp3` | "The Informant opens their eyes." | "Ο ρουφιάνος ανοίγει τα μάτια του." |
| `informant-sleep.mp3` | "The Informant closes their eyes." | "Ο ρουφιάνος κλείνει τα μάτια του." |

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

### 2. Add Atmospheric Audio Effects
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

