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

**Files modified:**

- **app.json** - Added iOS and Android configuration:
  - `bundleIdentifier`: `com.artemiscodes.palermo`
  - `buildNumber`: `"1"` (iOS internal build number)
  - `package`: `com.artemiscodes.palermo` (Android)
  - `versionCode`: `1` (Android internal build number)
  - `ITSAppUsesNonExemptEncryption`: `false` (standard encryption only)
  - `UIBackgroundModes`: `["audio"]` (for game narration)
  - EAS project ID linked

- **eas.json** - Created EAS Build and Submit configuration:
  - Development, preview, and production build profiles
  - iOS submit config with Apple credentials
  - Android submit config (for future Google Play)
  - `appVersionSource`: `"local"` (versions managed in app.json)

- **.gitignore** - Added `google-service-account.json` to prevent leaking credentials

### 2. Created Expo/EAS Account

- Account: `@artemisln` on expo.dev
- Project linked: `@artemisln/palermo`
- Free tier (30 builds/month)

### 3. Registered with Apple

- Apple Developer Program (Individual account)
- Team: Aikaterini Artemis Leonardou (JDHGY38643)
- Bundle ID `com.artemiscodes.palermo` registered on Apple Developer Portal

### 4. Created App in App Store Connect

- App name: "Μία Νύχτα στο Παλέρμο"
- Original name "Παλέρμο" was taken
- Apple ID: 6759204428
- Primary language: Greek

### 5. Generated iOS Credentials (via EAS)

EAS automatically created and manages:

- **Distribution Certificate**
  - Serial: 152E3B119F4F9CE799C86DF2514E0E8B
  - Expires: Feb 15, 2027

- **Provisioning Profile**
  - Developer Portal ID: HDQ7PATJ4C
  - Status: Active
  - Expires: Feb 15, 2027

- **App Store Connect API Key**
  - Generated for automated submissions

### 6. Built the iOS App

- First production build completed successfully
- Build URL: https://expo.dev/accounts/artemisln/projects/palermo/builds/675d867f-b70c-4bed-a837-850549946472
- Artifact: .ipa file ready for submission

### 7. Submitted to App Store Connect

- Used `eas submit --platform ios --latest`
- Uploads to TestFlight automatically after Apple processing (~15-30 min)

---

## What's Left To Do

### For TestFlight Release:
- [ ] Wait for Apple to process the build (~15-30 min)
- [ ] Test on real device via TestFlight app

### For App Store Release:
- [ ] Take screenshots (iPhone 6.7" and 6.5" sizes)
- [ ] Write app description (Greek and/or English)
- [ ] Create privacy policy URL
- [ ] Set up support URL
- [ ] Complete age rating questionnaire
- [ ] Fill in App Store listing in App Store Connect
- [ ] Submit for App Review (~24-48 hours)

### Optional Improvements:
- [ ] Add English localization to App Store listing
- [ ] Create app preview video
- [ ] Set up Google Play Store listing
- [ ] Consider changing developer display name to "Artemis Codes"

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

# Check project config
eas config
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
├── app.json              # App config (versions, bundle ID, icons, EAS project ID)
├── eas.json              # EAS Build & Submit configuration
├── .gitignore            # Excludes sensitive files (service account keys)
└── docs/
    ├── apple.md          # This file
    └── updating.md       # How to update the app
```
