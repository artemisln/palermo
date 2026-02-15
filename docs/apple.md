# Apple App Store - Publishing Progress

## App Information

| Field               | Value                                         |
| ------------------- | --------------------------------------------- |
| App Name            | Μία Νύχτα στο Παλέρμο (One Night in Palermo)  |
| Bundle ID           | com.artemiscodes.palermo                       |
| SKU                 | palermo                                        |
| Apple ID            | 6759204428                                     |
| Apple Team ID       | JDHGY38643                                     |
| Apple Account       | artemis.leona@gmail.com                        |
| EAS Project ID      | d7ae3f62-6dd6-4779-b097-b743033ea35d           |
| EAS Owner           | @artemisln                                     |

---

## What We've Done

### 1. Configured the App for Production
- Added `bundleIdentifier` and `package`: `com.artemiscodes.palermo`
- Set `buildNumber`: `"2"`, `versionCode`: `1`
- Added `ITSAppUsesNonExemptEncryption`: `false`
- Added `UIBackgroundModes`: `["audio"]` for game narration
- Linked EAS project ID

### 2. Created Expo/EAS Account
- Account: `@artemisln` on expo.dev
- Project: `@artemisln/palermo`
- Free tier (30 builds/month)

### 3. Registered with Apple
- Apple Developer Program (Individual account)
- Team: Aikaterini Artemis Leonardou (JDHGY38643)
- Bundle ID registered on Apple Developer Portal

### 4. Created App in App Store Connect
- App name: "Μία Νύχτα στο Παλέρμο"
- Original name "Παλέρμο" was taken
- Apple ID: 6759204428
- Primary language: Greek

### 5. Generated iOS Credentials (via EAS)
- **Distribution Certificate**: Serial 152E3B119F4F9CE799C86DF2514E0E8B (expires Feb 15, 2027)
- **Provisioning Profile**: HDQ7PATJ4C, active (expires Feb 15, 2027)
- **App Store Connect API Key**: Generated for automated submissions

### 6. Built and Submitted to App Store Connect
- Build 1.0.0 (1): Successfully built and uploaded
- Build URL: https://expo.dev/accounts/artemisln/projects/palermo/builds/675d867f-b70c-4bed-a837-850549946472
- Status: **Ready to Submit** on TestFlight
- Expires: May 16, 2026 (90-day TestFlight limit)

### 7. TestFlight Testing
- [x] Build processed by Apple
- [x] App available on TestFlight
- [x] Downloaded and tested on real device
- [x] Found and fixed keyboard dismiss bug on setup screen

### 8. Screenshots Captured
- [x] Screenshots saved to `assets/screenshots/`
- Screens captured:
  - `adding_players.png` - Player setup screen
  - `give_device_to.png` - Pass-the-phone role reveal
  - `role_reveal_citizen.png` - Citizen role reveal
  - `role_reveal_killer.png` - Killer role reveal
  - `kryfos_faneros_gnorizontai.png` - Hidden/Revealed killer intro
  - `nyxta_peftei_kleiste_matia.png` - Night falls narration
  - `stoxos_dolofonon.png` - Killer target selection
  - `poios_skotothike.png` - Kill announcement
  - `ksimerose.png` - Day discussion phase
  - `voting.png` - Voting phase
  - `apoblithike.png` - Player eliminated
  - `game_end_niki_dolofonon.png` - Killers win screen

---

## What's Left To Do

### For App Store Release:
- [ ] Prepare screenshots at required sizes (6.7" and 6.5" iPhone)
- [x] Write app description (see `docs/app_description.md`)
- [ ] Create and host privacy policy URL
- [ ] Set up support URL
- [ ] Complete age rating questionnaire in App Store Connect
- [ ] Fill in App Store listing (upload screenshots, description, keywords)
- [ ] Add English localization to listing (optional but recommended)
- [ ] Submit for App Review (~24-48 hours)

### Build 2 (Pending):
- [ ] Keyboard dismiss fix needs to be built and submitted
- [ ] buildNumber bumped to "2" in app.json

### Optional:
- [ ] Create app preview video
- [ ] Set up Google Play Store listing
- [ ] Consider changing developer display name to "Artemis Codes"

---

## Builds History

| Version | Build | Date         | Status           | Changes                    |
| ------- | ----- | ------------ | ---------------- | -------------------------- |
| 1.0.0   | 1     | Feb 15, 2026 | Ready to Submit  | Initial build              |
| 1.0.0   | 2     | Pending      | Not yet built    | Keyboard dismiss bug fix   |

---

## Useful Commands

```bash
# Check build status
eas build:list

# Build iOS
eas build --platform ios --profile production

# Build Android
eas build --platform android --profile production

# Build both
eas build --platform all --profile production

# Submit to App Store
eas submit --platform ios --latest

# Submit to Google Play
eas submit --platform android --latest

# View credentials
eas credentials
```

---

## Key URLs

- **EAS Dashboard**: https://expo.dev/accounts/artemisln/projects/palermo
- **App Store Connect**: https://appstoreconnect.apple.com
- **Apple Developer**: https://developer.apple.com
- **Apple Certificates**: https://developer.apple.com/account/resources/certificates
- **EAS Status**: https://status.expo.dev

---

## File Structure (Publishing Related)

```
palermo/
├── app.json                # App config (versions, bundle ID, icons, EAS project ID)
├── eas.json                # EAS Build & Submit configuration
├── .gitignore              # Excludes sensitive files
├── assets/screenshots/     # App Store screenshots
└── docs/
    ├── apple.md            # This file
    ├── app_description.md  # App Store descriptions (Greek & English)
    └── updating.md         # How to update the app
```
