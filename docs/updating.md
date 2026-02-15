# Updating Palermo

## How Easy Is It?

Three commands. That's it.

```bash
# 1. Bump the version
# 2. Build
# 3. Submit
```

---

## Step-by-Step Update Process

### 1. Make Your Code Changes

Write your code, test locally, commit as usual:

```bash
npx expo start --ios    # Test locally
git add .
git commit -m "your changes"
```

### 2. Bump Version Numbers in app.json

Open `app.json` and update:

```json
{
  "expo": {
    "version": "1.0.1",          // User-facing version (shown on App Store)
    "ios": {
      "buildNumber": "2"          // Must increment for EVERY build uploaded to Apple
    },
    "android": {
      "versionCode": 2            // Must increment for EVERY build uploaded to Google Play
    }
  }
}
```

#### Version Number Rules:

| Field          | What It Is                        | When to Change                          | Example Progression        |
| -------------- | --------------------------------- | --------------------------------------- | -------------------------- |
| `version`      | What users see on the App Store   | When releasing a meaningful update      | 1.0.0 → 1.0.1 → 1.1.0    |
| `buildNumber`  | Internal iOS build number         | Every single build you upload to Apple  | 1 → 2 → 3 → 4             |
| `versionCode`  | Internal Android build number     | Every single build you upload to Google | 1 → 2 → 3 → 4             |

#### Version Naming Convention:

- **1.0.0 → 1.0.1**: Bug fix or small tweak
- **1.0.0 → 1.1.0**: New feature added
- **1.0.0 → 2.0.0**: Major redesign or breaking change

### 3. Build

```bash
# iOS only
eas build --platform ios --profile production

# Android only
eas build --platform android --profile production

# Both at once
eas build --platform all --profile production
```

Wait ~15-25 minutes for the build to complete.

### 4. Submit

```bash
# iOS (uploads to App Store Connect / TestFlight)
eas submit --platform ios --latest

# Android (uploads to Google Play)
eas submit --platform android --latest
```

### 5. Release

#### For TestFlight (testing):
- The build appears automatically in TestFlight after Apple processes it (~15-30 min)
- Testers get notified of the update automatically
- No review needed for TestFlight internal testing

#### For App Store (production):
1. Go to App Store Connect → Your App
2. Click "+ Version or Platform" → iOS
3. Enter new version number (e.g., 1.0.1)
4. Select the new build
5. Fill in "What's New in This Version"
6. Submit for review (~24-48 hours)

---

## Quick Reference

### The 3-Command Update:

```bash
# After editing app.json version numbers:
eas build --platform ios --profile production
# Wait for build...
eas submit --platform ios --latest
```

### Common Scenarios:

#### "I fixed a bug and want to update TestFlight"
```bash
# 1. Increment buildNumber in app.json (e.g., "2" → "3")
# 2. Build and submit:
eas build --platform ios --profile production
eas submit --platform ios --latest
# Done! TestFlight updates automatically
```

#### "I want to release a new version to the App Store"
```bash
# 1. Increment version AND buildNumber in app.json
# 2. Build and submit:
eas build --platform ios --profile production
eas submit --platform ios --latest
# 3. Go to App Store Connect → create new version → select build → submit for review
```

#### "I made a tiny JavaScript-only change (no native changes)"
```bash
# You can use EAS Update for instant over-the-air updates (no rebuild needed!)
# First time setup:
npx expo install expo-updates
eas update:configure
# Then for each update:
eas update --branch production --message "Fixed typo in description"
```

---

## Important Notes

- **buildNumber must ALWAYS increase** - Apple rejects builds with the same or lower build number
- **versionCode must ALWAYS increase** - Google Play rejects builds with the same or lower version code
- You do NOT need to re-generate certificates - EAS remembers them
- You do NOT need to log in to Apple again (credentials are cached)
- TestFlight builds don't need App Store review (internal testers)
- App Store updates need review (~24-48 hours)
