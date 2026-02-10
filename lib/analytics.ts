/**
 * Analytics Utility Module
 * 
 * Privacy-safe, lightweight analytics tracking for the Palermo game app.
 * 
 * Environment Variables Required (all optional, analytics will fail silently if missing):
 * - EXPO_PUBLIC_FIREBASE_API_KEY: Firebase API key
 * - EXPO_PUBLIC_FIREBASE_PROJECT_ID: Firebase project ID
 * - EXPO_PUBLIC_FIREBASE_APP_ID: Firebase app ID
 * - EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID: Firebase GA4 measurement ID
 * 
 * Note: The EXPO_PUBLIC_ prefix makes these variables available in the app.
 * They should be defined in a .env file (not committed to git).
 * 
 * Usage:
 *   import { trackGameStarted, trackGameFinished } from '@/lib/analytics';
 *   
 *   trackGameStarted({ players_count: 6 });
 *   trackGameFinished({ players_count: 6, duration_seconds: 300, winner: 'GOOD' });
 */

import Constants from 'expo-constants';

// Type definitions for analytics events
export interface GameStartedParams {
  players_count: number;
}

export interface GameFinishedParams {
  players_count: number;
  duration_seconds: number;
  winner: string;
}

export interface SessionEndedParams {
  duration_seconds: number;
}

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  projectId: string;
  appId: string;
  measurementId: string;
}

/**
 * Gets Firebase configuration from environment variables
 * Returns null if any required variable is missing
 */
function getFirebaseConfig(): FirebaseConfig | null {
  try {
    // Access environment variables through expo-constants
    // These should be prefixed with EXPO_PUBLIC_ to be available in the app
    const apiKey = Constants.expoConfig?.extra?.firebaseApiKey || 
                   process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
    const projectId = Constants.expoConfig?.extra?.firebaseProjectId || 
                      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
    const appId = Constants.expoConfig?.extra?.firebaseAppId || 
                  process.env.EXPO_PUBLIC_FIREBASE_APP_ID;
    const measurementId = Constants.expoConfig?.extra?.firebaseMeasurementId || 
                          process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID;

    if (!apiKey || !projectId || !appId || !measurementId) {
      return null;
    }

    return { apiKey, projectId, appId, measurementId };
  } catch (error) {
    // Fail silently - analytics is optional
    return null;
  }
}

// Cache the config check result
let configChecked = false;
let cachedConfig: FirebaseConfig | null = null;

/**
 * Checks if analytics is enabled (all required env vars are present)
 */
function isAnalyticsEnabled(): boolean {
  if (!configChecked) {
    cachedConfig = getFirebaseConfig();
    configChecked = true;
  }
  return cachedConfig !== null;
}

/**
 * Logs an analytics event
 * This is a placeholder implementation that logs to console in development
 * In production with proper Firebase setup, this would send to Firebase Analytics
 */
async function logEvent(eventName: string, params: Record<string, any> = {}): Promise<void> {
  if (!isAnalyticsEnabled()) {
    // Fail silently - no config available
    return;
  }

  try {
    // In a real implementation, this would use Firebase Analytics SDK
    // For now, we'll use a console log that can be mocked in tests
    if (__DEV__) {
      console.log(`[Analytics] ${eventName}`, params);
    }

    // Note: In production, you would integrate with Firebase Analytics here
    // Example using Measurement Protocol (not recommended for production):
    // const config = cachedConfig!;
    // await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${config.measurementId}&api_secret=YOUR_API_SECRET`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     client_id: 'anonymous_client',
    //     events: [{
    //       name: eventName,
    //       params: params
    //     }]
    //   })
    // });
  } catch (error) {
    // Fail silently - analytics should never break the app
    if (__DEV__) {
      console.warn('[Analytics] Error logging event:', error);
    }
  }
}

/**
 * Track when a game is started
 * @param params - Game start parameters
 */
export async function trackGameStarted(params: GameStartedParams): Promise<void> {
  await logEvent('game_started', params);
}

/**
 * Track when a game is finished
 * @param params - Game finish parameters including winner and duration
 */
export async function trackGameFinished(params: GameFinishedParams): Promise<void> {
  await logEvent('game_finished', params);
}

/**
 * Track when a session is started
 * Called when the app first launches
 */
export async function trackSessionStarted(): Promise<void> {
  await logEvent('session_started', {});
}

/**
 * Track when a session is ended
 * Called when the app is about to close or go to background
 * @param params - Session end parameters
 */
export async function trackSessionEnded(params: SessionEndedParams): Promise<void> {
  await logEvent('session_ended', params);
}

/**
 * Check if analytics tracking is enabled
 * Exposed for testing purposes
 */
export function getAnalyticsEnabled(): boolean {
  return isAnalyticsEnabled();
}

/**
 * Reset analytics configuration cache
 * Exposed for testing purposes only
 * @internal
 */
export function resetAnalyticsConfig(): void {
  configChecked = false;
  cachedConfig = null;
}
