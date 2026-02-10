/**
 * Test helper utilities for Detox E2E tests
 */

/**
 * Adds multiple players to the game
 * @param {string[]} playerNames - Array of player names to add
 */
export async function addPlayers(playerNames) {
  for (const name of playerNames) {
    await element(by.id('player-name-input')).typeText(name);
    await element(by.id('add-player-button')).tap();
  }
}

/**
 * Progresses through role reveal for all players
 * @param {number} playerCount - Number of players to reveal roles for
 */
export async function progressThroughRoleReveal(playerCount) {
  for (let i = 0; i < playerCount; i++) {
    // Verify pass screen
    await expect(element(by.id('role-reveal-pass-screen'))).toBeVisible();
    
    // See role
    await element(by.id('see-role-button')).tap();
    
    // Verify role screen
    await expect(element(by.id('role-reveal-role-screen'))).toBeVisible();
    
    // Continue to next player or begin night
    await element(by.id('role-reveal-next-button')).tap();
  }
}

/**
 * Waits for night intro phase to complete
 */
export async function waitForNightIntroComplete() {
  await waitFor(element(by.id('night-intro-continue-button')))
    .toBeVisible()
    .withTimeout(30000);
  await element(by.id('night-intro-continue-button')).tap();
}

/**
 * Sets up a basic game with default players
 * @param {number} playerCount - Number of players (default: 5)
 * @returns {string[]} Array of player names
 */
export async function setupBasicGame(playerCount = 5) {
  const playerNames = [
    'Alice', 'Bob', 'Charlie', 'Diana', 'Eve',
    'Frank', 'Grace', 'Henry', 'Iris', 'Jack'
  ].slice(0, playerCount);
  
  await addPlayers(playerNames);
  await element(by.id('start-game-button')).tap();
  
  return playerNames;
}

/**
 * Delays execution for a specified time
 * 
 * WARNING: Avoid using fixed delays in tests. This utility should only be used
 * when absolutely necessary (e.g., waiting for animations that have no observable state change).
 * Prefer using waitFor() with element visibility checks instead.
 * 
 * @param {number} ms - Milliseconds to delay
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Reloads the app to a clean state
 */
export async function resetApp() {
  await device.reloadReactNative();
}
