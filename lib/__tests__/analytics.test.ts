/**
 * Unit tests for the analytics module
 * 
 * These tests verify:
 * - Events are called with correct names
 * - Correct parameters are passed
 * - Analytics functions are no-ops when env vars are missing
 * - No network calls are made (mocked Firebase)
 */

import {
  trackGameStarted,
  trackGameFinished,
  trackSessionStarted,
  trackSessionEnded,
  getAnalyticsEnabled,
  resetAnalyticsConfig,
} from '../analytics';

// Mock expo-constants to control environment variables
jest.mock('expo-constants', () => {
  let mockConfig = {
    expoConfig: {
      extra: {},
    },
  };

  return {
    __esModule: true,
    default: {
      get expoConfig() {
        return mockConfig.expoConfig;
      },
    },
    __setMockConfig: (config: any) => {
      mockConfig = config;
    },
    __resetMock: () => {
      mockConfig = {
        expoConfig: {
          extra: {},
        },
      };
    },
  };
});

// Get the mock module to control it
const Constants = require('expo-constants');

describe('Analytics Module', () => {
  beforeEach(() => {
    // Reset analytics config before each test
    resetAnalyticsConfig();
    
    // Reset mock configuration
    Constants.__resetMock();
    
    // Clear console mocks
    jest.clearAllMocks();
  });

  describe('Configuration', () => {
    it('should detect when analytics is disabled (no env vars)', () => {
      expect(getAnalyticsEnabled()).toBe(false);
    });

    it('should detect when analytics is enabled (all env vars present)', () => {
      // Set up complete config
      Constants.__setMockConfig({
        expoConfig: {
          extra: {
            firebaseApiKey: 'test-api-key',
            firebaseProjectId: 'test-project-id',
            firebaseAppId: 'test-app-id',
            firebaseMeasurementId: 'G-TEST123',
          },
        },
      });
      
      resetAnalyticsConfig();
      expect(getAnalyticsEnabled()).toBe(true);
    });

    it('should detect when analytics is disabled (partial env vars)', () => {
      // Only some vars present
      Constants.__setMockConfig({
        expoConfig: {
          extra: {
            firebaseApiKey: 'test-api-key',
            // Missing other required vars
          },
        },
      });
      
      resetAnalyticsConfig();
      expect(getAnalyticsEnabled()).toBe(false);
    });
  });

  describe('trackGameStarted', () => {
    it('should not throw when analytics is disabled', async () => {
      await expect(trackGameStarted({ players_count: 5 })).resolves.not.toThrow();
    });

    it('should log event when analytics is enabled', async () => {
      // Enable analytics
      Constants.__setMockConfig({
        expoConfig: {
          extra: {
            firebaseApiKey: 'test-api-key',
            firebaseProjectId: 'test-project-id',
            firebaseAppId: 'test-app-id',
            firebaseMeasurementId: 'G-TEST123',
          },
        },
      });
      
      resetAnalyticsConfig();
      
      await trackGameStarted({ players_count: 6 });
      
      // Verify console.log was called with correct event
      expect(console.log).toHaveBeenCalledWith(
        '[Analytics] game_started',
        { players_count: 6 }
      );
    });

    it('should accept different player counts', async () => {
      Constants.__setMockConfig({
        expoConfig: {
          extra: {
            firebaseApiKey: 'test-api-key',
            firebaseProjectId: 'test-project-id',
            firebaseAppId: 'test-app-id',
            firebaseMeasurementId: 'G-TEST123',
          },
        },
      });
      
      resetAnalyticsConfig();
      
      await trackGameStarted({ players_count: 10 });
      
      expect(console.log).toHaveBeenCalledWith(
        '[Analytics] game_started',
        { players_count: 10 }
      );
    });
  });

  describe('trackGameFinished', () => {
    it('should not throw when analytics is disabled', async () => {
      await expect(
        trackGameFinished({
          players_count: 5,
          duration_seconds: 300,
          winner: 'GOOD',
        })
      ).resolves.not.toThrow();
    });

    it('should log event with all parameters when analytics is enabled', async () => {
      Constants.__setMockConfig({
        expoConfig: {
          extra: {
            firebaseApiKey: 'test-api-key',
            firebaseProjectId: 'test-project-id',
            firebaseAppId: 'test-app-id',
            firebaseMeasurementId: 'G-TEST123',
          },
        },
      });
      
      resetAnalyticsConfig();
      
      await trackGameFinished({
        players_count: 7,
        duration_seconds: 450,
        winner: 'KILLERS',
      });
      
      expect(console.log).toHaveBeenCalledWith(
        '[Analytics] game_finished',
        {
          players_count: 7,
          duration_seconds: 450,
          winner: 'KILLERS',
        }
      );
    });

    it('should handle different winner types', async () => {
      Constants.__setMockConfig({
        expoConfig: {
          extra: {
            firebaseApiKey: 'test-api-key',
            firebaseProjectId: 'test-project-id',
            firebaseAppId: 'test-app-id',
            firebaseMeasurementId: 'G-TEST123',
          },
        },
      });
      
      resetAnalyticsConfig();
      
      const winners = ['GOOD', 'KILLERS', 'LOVERS'];
      
      for (const winner of winners) {
        await trackGameFinished({
          players_count: 6,
          duration_seconds: 300,
          winner,
        });
        
        expect(console.log).toHaveBeenCalledWith(
          '[Analytics] game_finished',
          expect.objectContaining({ winner })
        );
      }
    });
  });

  describe('trackSessionStarted', () => {
    it('should not throw when analytics is disabled', async () => {
      await expect(trackSessionStarted()).resolves.not.toThrow();
    });

    it('should log event when analytics is enabled', async () => {
      Constants.__setMockConfig({
        expoConfig: {
          extra: {
            firebaseApiKey: 'test-api-key',
            firebaseProjectId: 'test-project-id',
            firebaseAppId: 'test-app-id',
            firebaseMeasurementId: 'G-TEST123',
          },
        },
      });
      
      resetAnalyticsConfig();
      
      await trackSessionStarted();
      
      expect(console.log).toHaveBeenCalledWith(
        '[Analytics] session_started',
        {}
      );
    });
  });

  describe('trackSessionEnded', () => {
    it('should not throw when analytics is disabled', async () => {
      await expect(
        trackSessionEnded({ duration_seconds: 100 })
      ).resolves.not.toThrow();
    });

    it('should log event with duration when analytics is enabled', async () => {
      Constants.__setMockConfig({
        expoConfig: {
          extra: {
            firebaseApiKey: 'test-api-key',
            firebaseProjectId: 'test-project-id',
            firebaseAppId: 'test-app-id',
            firebaseMeasurementId: 'G-TEST123',
          },
        },
      });
      
      resetAnalyticsConfig();
      
      await trackSessionEnded({ duration_seconds: 250 });
      
      expect(console.log).toHaveBeenCalledWith(
        '[Analytics] session_ended',
        { duration_seconds: 250 }
      );
    });
  });

  describe('Silent Failures', () => {
    it('should not throw errors when config is malformed', async () => {
      Constants.__setMockConfig({
        expoConfig: null, // Malformed config
      });
      
      resetAnalyticsConfig();
      
      // All functions should complete without throwing
      await expect(trackGameStarted({ players_count: 5 })).resolves.not.toThrow();
      await expect(trackGameFinished({ 
        players_count: 5, 
        duration_seconds: 300, 
        winner: 'GOOD' 
      })).resolves.not.toThrow();
      await expect(trackSessionStarted()).resolves.not.toThrow();
      await expect(trackSessionEnded({ duration_seconds: 100 })).resolves.not.toThrow();
    });

    it('should not log to console when analytics is disabled', async () => {
      // Analytics disabled by default
      await trackGameStarted({ players_count: 5 });
      await trackGameFinished({ 
        players_count: 5, 
        duration_seconds: 300, 
        winner: 'GOOD' 
      });
      await trackSessionStarted();
      await trackSessionEnded({ duration_seconds: 100 });
      
      // Console.log should not have been called
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('Event Names', () => {
    it('should use correct event names', async () => {
      Constants.__setMockConfig({
        expoConfig: {
          extra: {
            firebaseApiKey: 'test-api-key',
            firebaseProjectId: 'test-project-id',
            firebaseAppId: 'test-app-id',
            firebaseMeasurementId: 'G-TEST123',
          },
        },
      });
      
      resetAnalyticsConfig();
      
      await trackGameStarted({ players_count: 5 });
      expect(console.log).toHaveBeenCalledWith(
        '[Analytics] game_started',
        expect.any(Object)
      );
      
      await trackGameFinished({ 
        players_count: 5, 
        duration_seconds: 300, 
        winner: 'GOOD' 
      });
      expect(console.log).toHaveBeenCalledWith(
        '[Analytics] game_finished',
        expect.any(Object)
      );
      
      await trackSessionStarted();
      expect(console.log).toHaveBeenCalledWith(
        '[Analytics] session_started',
        expect.any(Object)
      );
      
      await trackSessionEnded({ duration_seconds: 100 });
      expect(console.log).toHaveBeenCalledWith(
        '[Analytics] session_ended',
        expect.any(Object)
      );
    });
  });
});
