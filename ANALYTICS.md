# Analytics Setup Guide

This document explains how to set up Firebase Analytics (GA4) for the Palermo app.

## Overview

The app includes lightweight, privacy-safe analytics tracking that:
- Tracks anonymous game sessions
- Does NOT collect any personally identifiable information (PII)
- Does NOT track player names
- Works silently if Firebase credentials are not configured
- Is fully tested with unit tests

## Tracked Events

The following events are tracked:

1. **session_started** - When the app opens
2. **session_ended** - When the app closes or goes to background
   - Parameters: `duration_seconds`

3. **game_started** - When a new game begins (role reveal phase)
   - Parameters: `players_count`

4. **game_finished** - When a game ends
   - Parameters: `players_count`, `duration_seconds`, `winner` (GOOD/KILLERS/LOVERS)

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Add a web app to your project
4. Enable Google Analytics (GA4) for your project

### 2. Get Your Configuration

From the Firebase Console, you'll need:
- **API Key** (`firebaseConfig.apiKey`)
- **Project ID** (`firebaseConfig.projectId`)
- **App ID** (`firebaseConfig.appId`)
- **Measurement ID** (from Google Analytics, starts with `G-`)

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Firebase credentials:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Never commit the `.env` file!** It's already in `.gitignore`.

### 4. Test Analytics

After configuration:

1. Start the app: `npm start`
2. In development mode, you'll see analytics events in the console:
   ```
   [Analytics] session_started {}
   [Analytics] game_started { players_count: 6 }
   [Analytics] game_finished { players_count: 6, duration_seconds: 300, winner: 'GOOD' }
   ```

3. Check Firebase Console after a few hours to see real data

## Running Without Analytics

The app works perfectly fine without Firebase configuration:
- If environment variables are missing, analytics silently fails
- No errors or warnings are shown to users
- The game experience is completely unaffected

## Development

### Running Tests

```bash
npm test                 # Run tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

All tests mock Firebase to avoid network calls.

### Analytics Module Location

- **Implementation**: `lib/analytics.ts`
- **Tests**: `lib/__tests__/analytics.test.ts`
- **Integration**: `app/_layout.tsx` (session tracking) and `app/index.tsx` (game tracking)

## Privacy & Compliance

The analytics implementation:
- ✅ Does NOT collect user IDs
- ✅ Does NOT collect player names
- ✅ Does NOT collect any PII
- ✅ Only tracks anonymous usage patterns
- ✅ Uses Firebase's built-in anonymization

For GDPR/privacy compliance:
- Consider adding a consent prompt if required in your region
- Review Firebase's data processing terms
- Update your privacy policy to mention analytics usage

## Troubleshooting

**Analytics not showing in Firebase:**
- Wait 24-48 hours for initial data to appear
- Check that all 4 environment variables are correctly set
- Verify your Firebase project has Google Analytics enabled
- Check the Firebase Console > Analytics > Events section

**Console shows "[Analytics] Error logging event":**
- Check your Firebase configuration
- Verify API keys are correct
- Ensure your Firebase project is active

**Tests failing:**
- Run `npm install` to ensure all dependencies are installed
- Check that `jest.config.js` and `jest.setup.js` are present
- Clear Jest cache: `npx jest --clearCache`

## Future Enhancements

Possible future improvements:
- Integration with Firebase Analytics SDK when Expo adds better support
- Custom dashboard for visualizing game statistics
- A/B testing for game balance
- Cohort analysis for player retention

## Support

For issues or questions:
1. Check Firebase Analytics documentation
2. Review the test files for usage examples
3. Check the console logs in development mode
