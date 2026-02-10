# App Store Readiness Checklist

This document outlines everything needed to submit **Palermo** (an offline party game) to the Apple App Store and Google Play Store.

**Context:**
- Solo indie developer
- No backend infrastructure
- Offline, single-device gameplay
- Privacy-first (no accounts, no personal data)

---

## 1. App Functionality Checklist

Before submission, ensure the app works flawlessly:

- [ ] App launches without crashes on fresh install
- [ ] Core gameplay flow works end-to-end (setup → role reveal → night → day → voting → end)
- [ ] All audio narration plays correctly
- [ ] Timer functions work properly
- [ ] Role assignment randomization works for all player counts
- [ ] Optional roles (Doctor, Informant, Lovers) function correctly when enabled
- [ ] Win condition detection works (Good wins, Killers win, Lovers win)
- [ ] App handles backgrounding gracefully (pause audio, maintain state)
- [ ] App resumes correctly when reopened
- [ ] "New Round" resets game state properly
- [ ] AsyncStorage persists player names across sessions
- [ ] No placeholder UI, lorem ipsum, or dead screens
- [ ] Settings panel opens and saves preferences
- [ ] All buttons are responsive and functional

---

## 2. iOS (Apple App Store) Requirements

### Account & Setup

- [ ] **Apple Developer Program membership** ($99/year)
  - Enroll at [developer.apple.com](https://developer.apple.com)
  - Wait for approval (can take 24-48 hours)

- [ ] **Bundle ID configured** in app.json
  - Format: `com.yourdomain.palermo`
  - Must be unique and match App Store Connect
  - Update in `app.json`: `"ios": { "bundleIdentifier": "com.yourdomain.palermo" }`

### Assets

- [ ] **App Icon** (all required sizes)
  - 1024×1024px for App Store (PNG, no transparency, no rounded corners)
  - Expo auto-generates other sizes from `./assets/images/icon.png`
  - Ensure icon is polished and represents the game

- [ ] **Launch Screen / Splash Screen**
  - Already configured via `expo-splash-screen` plugin
  - Verify it displays correctly on various devices
  - Background color: `#0B0E14` (matches game aesthetic)

### Build Configuration

- [ ] **Version number** set in app.json
  - `"version": "1.0.0"` (semantic versioning)
  
- [ ] **Build number** set in app.json
  - `"ios": { "buildNumber": "1" }`
  - Increment with each new build (Apple requires this)

- [ ] **Run production build**
  - `eas build --platform ios --profile production`
  - Test the production build thoroughly

### Testing

- [ ] **TestFlight setup**
  - Upload build via EAS or Xcode
  - Add internal testers (yourself + any beta testers)
  - Test on multiple iOS devices if possible
  - Verify no crashes, audio works, gameplay flows correctly

- [ ] **TestFlight feedback addressed**
  - Fix any issues discovered during testing
  - Upload new builds and retest

### App Store Connect

- [ ] **App Store listing created**
  - Go to [App Store Connect](https://appstoreconnect.apple.com)
  - Create new app with matching Bundle ID
  - Fill in all required metadata

- [ ] **App review information prepared**
  - Review notes for Apple (explain the game concept)
  - Demo account: Not applicable (no login)
  - Contact information (in case reviewers have questions)

- [ ] **Age rating questionnaire completed**
  - Likely 12+ or 13+ (social deduction, no violence depicted)
  - No gambling, no realistic violence, no user-generated content

---

## 3. Android (Google Play) Requirements

### Account & Setup

- [ ] **Google Play Developer account** ($25 one-time fee)
  - Register at [play.google.com/console](https://play.google.com/console)

- [ ] **Application ID configured** in app.json
  - Format: `com.yourdomain.palermo`
  - Must match iOS for consistency (optional but recommended)
  - Update in `app.json`: `"android": { "package": "com.yourdomain.palermo" }`

### Assets

- [ ] **App Icon & Adaptive Icon**
  - Already configured in app.json:
    - `foregroundImage`: `./assets/images/android-icon-foreground.png`
    - `backgroundImage`: `./assets/images/android-icon-background.png`
    - `monochromeImage`: `./assets/images/android-icon-monochrome.png`
  - Verify icons look good on various Android launchers
  - Ensure monochrome version works for themed icons (Android 13+)

- [ ] **Feature Graphic** (required for Play Store listing)
  - 1024×500px PNG or JPEG
  - Showcases game title/concept
  - No transparency

- [ ] **Screenshots**
  - At least 2, maximum 8
  - Various screen sizes (phone, tablet if supported)

### Build Configuration

- [ ] **Version name** set in app.json
  - `"version": "1.0.0"` (user-facing)

- [ ] **Version code** set in app.json
  - `"android": { "versionCode": 1 }`
  - Increment with each new build (integer only)

- [ ] **Run production build**
  - `eas build --platform android --profile production`
  - Generates AAB (Android App Bundle)

### Testing

- [ ] **Internal testing track setup**
  - Upload AAB to Google Play Console
  - Create internal testing release
  - Add yourself and testers
  - Download and test on real Android devices

- [ ] **Test key scenarios**
  - Fresh install behavior
  - Audio playback on various devices
  - Dark mode support
  - Edge-to-edge display (Android 15+)

### Google Play Console

- [ ] **Store listing completed**
  - App name, short description, full description
  - Screenshots, feature graphic
  - App category: Games > Board, or Games > Casual
  - Content rating questionnaire completed

- [ ] **Release notes prepared**
  - Brief description of version 1.0.0
  - Highlight key features (offline party game, audio narration, etc.)

---

## 4. Privacy & Compliance

Since this is a **privacy-first, offline game** with no backend, no login, and no personal data collection:

### What to Disclose

- [ ] **Analytics (if using any)**
  - If using Expo's anonymous analytics or crash reporting, disclose it
  - Mark as "anonymous" and "for app functionality only"

- [ ] **No personal data collected**
  - Player names stored locally only (AsyncStorage)
  - No data leaves the device
  - No network requests

### Apple App Store Privacy Questionnaire

- [ ] **Data collection disclosure**
  - Select "No" for all personal data types
  - If using crash reporting: select "Crash Data" and mark as "not linked to user"

- [ ] **Privacy Policy URL**
  - Optional for offline apps with no data collection
  - If you add one, host it publicly and link it

### Google Play Data Safety Form

- [ ] **Complete Data Safety section**
  - "No data collected or shared with third parties"
  - If using crash analytics: disclose as "crash logs, not linked to user identity"

- [ ] **Offline usage statement**
  - Clearly state in description: "Works completely offline, no internet required"

---

## 5. Assets & Store Listing

### App Name & Branding

- [ ] **App name finalized:** "Palermo" or "Palermo: Party Game"
- [ ] **Subtitle/tagline** (iOS, 30 chars max)
  - Example: "Social Deduction Party Game"

### Descriptions

- [ ] **Short description** (Google Play, 80 chars)
  - Example: "Offline narrator for social deduction party games. One device, 5+ players."

- [ ] **Long description** (both platforms, 4000 chars max)
  - Explain gameplay (social deduction, roles, night/day phases)
  - Emphasize offline, single-device, no accounts
  - Mention audio narration
  - List key features (optional roles, timer, win detection)
  - Target audience: party game enthusiasts, social groups

### Screenshots

Capture the following screens:

- [ ] **Setup screen** (player name entry + settings gear)
- [ ] **Role reveal screen** (example: "You are the Detective")
- [ ] **Night phase** (dark UI, narration text)
- [ ] **Day discussion** (player list, timer)
- [ ] **Voting screen** (elimination selection)
- [ ] **End screen** (winner announcement + role reveal)

Tips:
- Use on-screen mockups or actual device screenshots
- Show different phases to convey game flow
- Ensure text is readable, UI looks polished
- Capture in portrait orientation
- Use both light and dark mode screenshots if supported

### Keywords (iOS only)

- [ ] **100 characters max** (comma-separated, no spaces after commas)
  - Example: `party,game,social,deduction,mafia,werewolf,offline,multiplayer,narrator,audio,roles`

### Feature Graphic (Android)

- [ ] **Design 1024×500px graphic**
  - Include game name: "Palermo"
  - Use dark theme colors (`#0B0E14` background)
  - Add tagline or visual element (moon, night sky, etc.)

---

## 6. QA & Pre-Submission Checks

### Device Testing

- [ ] **Test on small phones** (iPhone SE, Pixel 4a)
  - Ensure buttons are not too small
  - Text is readable

- [ ] **Test on large phones** (iPhone 15 Pro Max, Galaxy S24 Ultra)
  - UI scales appropriately
  - No awkward whitespace

- [ ] **Test on tablets** (iPad, Android tablets)
  - Layout looks good on larger screens
  - Text/buttons scale well

### Dark Mode

- [ ] **Verify dark mode support**
  - Set in app.json: `"userInterfaceStyle": "automatic"`
  - Test forced dark mode on device
  - Ensure colors remain readable

### Offline Behavior

- [ ] **Enable airplane mode**
  - App launches without issues
  - No network error messages
  - Gameplay functions normally

### Audio Testing

- [ ] **Audio on/off behavior**
  - Test with volume up (narration audible)
  - Test with volume down or muted (app still usable)
  - Verify audio stops when backgrounding
  - Verify audio resumes correctly when reopening

### Accessibility Basics

- [ ] **Large text scaling**
  - Test with system font size increased
  - Ensure UI doesn't break

- [ ] **VoiceOver / TalkBack testing** (optional but recommended)
  - Test screen reader support
  - Add accessibility labels to key buttons

- [ ] **Color contrast**
  - Verify text is readable against dark background
  - Check for sufficient contrast (WCAG AA recommended)

### Edge Cases

- [ ] **Minimum player count validation** (5 players required)
- [ ] **Optional roles validation** (correct player count for each role)
- [ ] **Interrupted gameplay** (app backgrounded during night phase, during audio playback)
- [ ] **Rapid tapping** (buttons don't trigger twice, no race conditions)

---

## 7. Optional but Recommended

### Crash Reporting

- [ ] **Integrate Sentry or BugSnag**
  - Catch production crashes you can't reproduce locally
  - Monitor after launch

- [ ] **Anonymous analytics**
  - Expo Analytics or PostHog (self-hosted if privacy-conscious)
  - Track: app opens, rounds played, player count distribution
  - Do not track: player names or any identifying info

### Pre-Launch Validation

- [ ] **Run production build on physical devices**
  - iOS: via TestFlight
  - Android: via internal testing track

- [ ] **Have others playtest**
  - Recruit 5-10 people to play a full round
  - Observe for confusion, bugs, or UX issues

### Post-Launch Monitoring Plan

- [ ] **Monitor app store reviews**
  - Respond to user feedback
  - Track common complaints or bugs

- [ ] **Plan for updates**
  - Set a cadence for bug fixes (e.g., biweekly)
  - Prepare for new features or roles (post-MVP)

- [ ] **Marketing plan** (if desired)
  - Share on Reddit (r/boardgames, r/socialgames)
  - Post on Twitter, Instagram, TikTok with gameplay clips
  - Local party game communities

---

## Final Pre-Submission Checklist

Before hitting "Submit for Review":

- [ ] All functionality checklists completed
- [ ] Production builds tested on iOS and Android
- [ ] Store listings fully filled out (name, description, screenshots, etc.)
- [ ] Privacy questionnaires completed accurately
- [ ] App review notes prepared (explain game to reviewers)
- [ ] Age rating selected
- [ ] No crashes in production builds
- [ ] All assets meet platform requirements (icon sizes, feature graphic, etc.)
- [ ] Version numbers and build numbers set correctly
- [ ] Audio and gameplay tested in various scenarios
- [ ] Offline mode confirmed working

---

**Good luck with your launch! 🚀**

If you encounter rejections, read Apple/Google's feedback carefully and address specific concerns. Common rejection reasons for games:
- Crashes on launch
- Misleading screenshots or descriptions
- Privacy policy missing (if data is collected)
- Age rating mismatch with content

Iterate, resubmit, and don't give up. First submissions often require minor tweaks.
