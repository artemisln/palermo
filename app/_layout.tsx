import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import { trackSessionStarted, trackSessionEnded } from '@/lib/analytics';
import { AppState } from 'react-native';

export default function RootLayout() {
  const sessionStartTime = useRef(Date.now());

  useEffect(() => {
    // Track session start when app loads
    trackSessionStarted();

    // Track session end when app goes to background or closes
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
        trackSessionEnded({ duration_seconds: duration });
      } else if (nextAppState === 'active') {
        // Reset session start time when app comes back to foreground
        sessionStartTime.current = Date.now();
        trackSessionStarted();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
