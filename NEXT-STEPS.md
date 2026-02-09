# Palermo — Next Steps

## TODO

### 1. Add Logo
- Design/source a Palermo logo (dark theme, cinematic feel)
- Add logo image to `assets/images/logo.png` (include @2x and @3x variants)
- Display on the Setup screen in place of or above the "PALERMO" text title
- Use on the splash screen (`app.json` splash config)

### 2. Add Audio Narration Files
- Record or source voice narration for each line
- Place files in `assets/audio/`
- Format: **MP3** (best compatibility across iOS/Android, small file size, supported natively by `expo-av`)

#### Required Audio Files

| File | Narration Text |
|---|---|
| `night-falls.mp3` | "Night falls on Palermo. Everyone close your eyes." |
| `killers-wake.mp3` | "Hidden Killer and Revealed Killer, open your eyes and meet each other." |
| `close-eyes.mp3` | "Close your eyes." |
| `detective-wake.mp3` | "Revealed Killer, raise your hand. Detective, open your eyes." |
| `everyone-close-eyes.mp3` | "Everyone close your eyes." |
| `lovers-wake.mp3` | "Lovers, open your eyes and find each other." |
| `dawn-breaks.mp3` | "Dawn breaks. Everyone open your eyes." |
| `night-again.mp3` | "Night falls again. Everyone close your eyes." |
| `killers-choose.mp3` | "Killers, whisper your target to the messenger." |
| `doctor-wake.mp3` | "Doctor, open your eyes. Choose someone to save." |
| `doctor-sleep.mp3` | "Doctor, close your eyes." |
| `informant-wake.mp3` | "Informant, open your eyes." |
| `informant-sleep.mp3` | "Informant, close your eyes." |

#### Audio Guidelines
- Tone: calm, low, cinematic — think narrator in a thriller
- Pace: slow and deliberate
- No background music in the voice clips (can layer ambient separately later)
- Sample rate: 44.1kHz, stereo or mono, 128kbps+ bitrate
- Keep each file short (3–8 seconds)

#### Integration
- `expo-av` is already installed
- Update `lib/narration.ts` to map each key to its audio file via `require()`
- Update `night-intro-phase.tsx` and `night-kill-phase.tsx` to use `Audio.Sound.createAsync()` + `playAsync()` instead of timers
- Lock UI buttons while audio is playing
- Fall back to timed text display if audio fails to load
