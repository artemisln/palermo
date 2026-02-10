# E2E Tests

This directory contains end-to-end (E2E) tests for the Palermo app using Detox.

## Test Coverage

The E2E tests cover the following critical user flows:

1. **App Launch** - App launches without crashing
2. **Game Setup** - User can add player names and configure game settings
3. **Game Start** - User can start a new game
4. **Role Reveal** - User can progress through role reveal flow for all players
5. **Gameplay Phase** - User can reach the main gameplay phase (day/night cycles)
6. **Complete Game** - User can complete a full game cycle and reach the end screen
7. **App State** - App can be backgrounded and resumed without breaking state

## Test Files

- `smoke.e2e.js` - Basic smoke tests to verify core functionality
- `game-flow.e2e.js` - Comprehensive tests for the full game flow

## Running Tests Locally

### Prerequisites

- Node.js 20+
- iOS: Xcode 15+ and iOS Simulator
- Android: Android Studio, Android SDK, and Android Emulator

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Prebuild the native apps:
   ```bash
   npx expo prebuild --platform ios
   npx expo prebuild --platform android
   ```

### Running Tests

#### iOS

```bash
# Build the app for testing
npm run e2e:build:ios

# Run the tests
npm run e2e:test:ios
```

#### Android

```bash
# Build the app for testing
npm run e2e:build:android

# Run the tests
npm run e2e:test:android
```

### Running Specific Tests

```bash
# Run a specific test file
detox test e2e/smoke.e2e.js --configuration ios.sim.debug
```

## CI/CD

E2E tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual workflow dispatch

See `.github/workflows/e2e-tests.yml` for CI configuration.

## Test Structure

All tests follow this pattern:

```javascript
describe('Test Suite', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should do something', async () => {
    await expect(element(by.id('some-testID'))).toBeVisible();
    await element(by.id('some-button')).tap();
  });
});
```

## Test IDs

The app components use `testID` props for reliable test selectors:

- Setup phase: `setup-title`, `player-name-input`, `add-player-button`, `start-game-button`
- Role reveal: `role-reveal-pass-screen`, `see-role-button`, `role-reveal-next-button`
- Day phase: `day-discussion-phase`, `day-timer`, `begin-voting-button`
- Voting phase: `voting-phase`, `vote-increase-{id}`, `end-voting-button`
- Night phase: `night-intro-phase`, `night-kill-phase`
- End phase: `end-phase`, `end-winner-text`, `new-round-button`

## Troubleshooting

### Tests fail with "Cannot find element"

- Ensure the app has been built: `npm run e2e:build:ios` or `npm run e2e:build:android`
- Check that testIDs are correct in the components
- Increase timeouts if elements take time to appear

### iOS Simulator issues

- Reset simulator: `xcrun simctl erase all`
- Rebuild app: `npm run e2e:build:ios`

### Android Emulator issues

- Ensure emulator is running: `emulator -avd Pixel_3a_API_34_extension_level_7_x86_64`
- Check emulator name matches `.detoxrc.js` configuration
- Rebuild app: `npm run e2e:build:android`

## Best Practices

1. **Use testIDs** - Always use `testID` props, never rely on text content or styling
2. **Wait for elements** - Use `waitFor()` for elements that may take time to appear
3. **Clean state** - Reset app state between tests using `device.reloadReactNative()`
4. **Avoid timing assumptions** - Don't use fixed delays, use `waitFor()` instead
5. **Test isolation** - Each test should be independent and not rely on previous tests

## References

- [Detox Documentation](https://wix.github.io/Detox/)
- [Expo + Detox Guide](https://docs.expo.dev/build-reference/e2e-tests/)
- [Jest Matchers](https://wix.github.io/Detox/docs/api/matchers)
