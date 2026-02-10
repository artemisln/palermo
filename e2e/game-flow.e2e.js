describe('Palermo E2E Tests - Critical User Flows', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: 'YES' },
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  /**
   * Test 1: App launches without crashing
   */
  it('should launch app successfully and show setup screen', async () => {
    await expect(element(by.id('setup-title'))).toBeVisible();
    await expect(element(by.id('player-name-input'))).toBeVisible();
    await expect(element(by.id('start-game-button'))).toBeVisible();
  });

  /**
   * Test 2 & 3: User can start a new game and enter player names
   */
  it('should allow user to add players and start a game', async () => {
    // Add 5 players (minimum required)
    const playerNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
    
    for (const name of playerNames) {
      await element(by.id('player-name-input')).typeText(name);
      await element(by.id('add-player-button')).tap();
    }

    // Verify all players are added
    await expect(element(by.id('player-count'))).toBeVisible();

    // Start the game
    await element(by.id('start-game-button')).tap();

    // Verify we're in role reveal phase
    await expect(element(by.id('role-reveal-pass-screen'))).toBeVisible();
  });

  /**
   * Test 4: User can progress through role reveal flow
   */
  it('should progress through role reveal for all players', async () => {
    // Add 5 players
    const playerNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
    
    for (const name of playerNames) {
      await element(by.id('player-name-input')).typeText(name);
      await element(by.id('add-player-button')).tap();
    }

    await element(by.id('start-game-button')).tap();

    // Go through role reveal for all players
    for (let i = 0; i < playerNames.length; i++) {
      // Verify pass screen
      await expect(element(by.id('role-reveal-pass-screen'))).toBeVisible();
      await expect(element(by.id('role-reveal-player-name'))).toBeVisible();
      
      // See role
      await element(by.id('see-role-button')).tap();
      
      // Verify role screen
      await expect(element(by.id('role-reveal-role-screen'))).toBeVisible();
      await expect(element(by.id('role-reveal-role-name'))).toBeVisible();
      
      // Continue to next player or begin night
      await element(by.id('role-reveal-next-button')).tap();
    }

    // After all players, should transition to night intro
    await expect(element(by.id('night-intro-phase'))).toBeVisible();
  });

  /**
   * Test 5: User can reach the main gameplay phase (day/night)
   */
  it('should reach day discussion phase after night intro', async () => {
    // Add 5 players
    const playerNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
    
    for (const name of playerNames) {
      await element(by.id('player-name-input')).typeText(name);
      await element(by.id('add-player-button')).tap();
    }

    await element(by.id('start-game-button')).tap();

    // Skip through role reveal quickly
    for (let i = 0; i < playerNames.length; i++) {
      await element(by.id('see-role-button')).tap();
      await element(by.id('role-reveal-next-button')).tap();
    }

    // Wait for night intro phase
    await expect(element(by.id('night-intro-phase'))).toBeVisible();

    // Wait for auto-progression or manual continue button
    // Night intro has auto-timers, so we wait for the continue button to appear
    await waitFor(element(by.id('night-intro-continue-button')))
      .toBeVisible()
      .withTimeout(30000);
    
    await element(by.id('night-intro-continue-button')).tap();

    // Verify we're in day discussion phase
    await expect(element(by.id('day-discussion-phase'))).toBeVisible();
    await expect(element(by.id('day-timer'))).toBeVisible();
  });

  /**
   * Test 6: User can complete a full game cycle and reach the end screen
   * 
   * Note: This test verifies we can reach the voting phase. 
   * Full voting functionality requires interacting with dynamically generated player IDs,
   * which would make the test brittle. The test confirms the voting UI is accessible.
   */
  it('should complete a full game cycle to voting phase', async () => {
    // Add 5 players
    const playerNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
    
    for (const name of playerNames) {
      await element(by.id('player-name-input')).typeText(name);
      await element(by.id('add-player-button')).tap();
    }

    await element(by.id('start-game-button')).tap();

    // Skip through role reveal
    for (let i = 0; i < playerNames.length; i++) {
      await element(by.id('see-role-button')).tap();
      await element(by.id('role-reveal-next-button')).tap();
    }

    // Wait for night intro to complete
    await waitFor(element(by.id('night-intro-continue-button')))
      .toBeVisible()
      .withTimeout(30000);
    await element(by.id('night-intro-continue-button')).tap();

    // Day discussion phase - begin voting
    await expect(element(by.id('day-discussion-phase'))).toBeVisible();
    await element(by.id('begin-voting-button')).tap();

    // Voting phase - verify voting UI is accessible
    await expect(element(by.id('voting-phase'))).toBeVisible();
    
    // Wait for player list to load
    await waitFor(element(by.id('voting-player-list'))).toBeVisible().withTimeout(2000);
    
    // Verify voting interface elements are present
    await expect(element(by.id('voting-total-votes'))).toBeVisible();
    await expect(element(by.id('end-voting-button'))).toBeVisible();
  });

  /**
   * Test 7: App can be backgrounded and resumed without breaking state
   */
  it('should maintain state when backgrounded and resumed', async () => {
    // Add players
    const playerNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
    
    for (const name of playerNames) {
      await element(by.id('player-name-input')).typeText(name);
      await element(by.id('add-player-button')).tap();
    }

    // Verify player count before backgrounding
    await expect(element(by.id('player-count'))).toBeVisible();

    // Background the app
    await device.sendToHome();
    
    // Wait a moment for the app to fully background
    await waitFor(element(by.id('setup-title')))
      .not.toBeVisible()
      .withTimeout(2000)
      .catch(() => {}); // Ignore if element becomes invisible

    // Resume the app
    await device.launchApp({ newInstance: false });

    // Verify state is maintained
    await expect(element(by.id('setup-title'))).toBeVisible();
    await expect(element(by.id('player-count'))).toBeVisible();
    
    // Verify start button is still enabled (players still there)
    await element(by.id('start-game-button')).tap();
    await expect(element(by.id('role-reveal-pass-screen'))).toBeVisible();
  });
});
