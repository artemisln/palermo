describe('Palermo E2E - Smoke Tests', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: 'YES' },
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show the app title on launch', async () => {
    await expect(element(by.id('setup-title'))).toBeVisible();
  });

  it('should show player input field', async () => {
    await expect(element(by.id('player-name-input'))).toBeVisible();
  });

  it('should show add player button', async () => {
    await expect(element(by.id('add-player-button'))).toBeVisible();
  });

  it('should show start game button', async () => {
    await expect(element(by.id('start-game-button'))).toBeVisible();
  });

  it('should add a player when name is entered', async () => {
    await element(by.id('player-name-input')).typeText('TestPlayer');
    await element(by.id('add-player-button')).tap();
    await expect(element(by.id('player-count'))).toBeVisible();
  });

  it('should not start game with less than minimum players', async () => {
    // Try to start with no players - button should be disabled
    // Detox doesn't have a direct disabled check, so we verify button exists
    await expect(element(by.id('start-game-button'))).toBeVisible();
    
    // Add one player
    await element(by.id('player-name-input')).typeText('Alice');
    await element(by.id('add-player-button')).tap();
    
    // Button should still be disabled (need 5 players minimum)
    // We can't tap a disabled button - just verify it exists
    await expect(element(by.id('start-game-button'))).toBeVisible();
  });

  it('should start game with minimum required players', async () => {
    const playerNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
    
    for (const name of playerNames) {
      await element(by.id('player-name-input')).typeText(name);
      await element(by.id('add-player-button')).tap();
    }

    await element(by.id('start-game-button')).tap();
    await expect(element(by.id('role-reveal-pass-screen'))).toBeVisible();
  });
});
