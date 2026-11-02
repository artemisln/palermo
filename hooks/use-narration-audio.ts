import { useCallback, useEffect, useRef } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { getNarrationAudio } from '@/lib/narration';
import { Language } from '@/lib/messages';

const POST_AUDIO_PAUSE = 2000; // ms to wait after audio finishes

export function useNarrationAudio(language: Language) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const audioMap = getNarrationAudio(language);

  const cleanup = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {
        // ignore cleanup errors
      }
      soundRef.current = null;
    }
  }, []);

  const playStep = useCallback(
    async (key: string): Promise<void> => {
      await cleanup();

      const source = audioMap[key];
      if (!source) return;

      try {
        const { sound } = await Audio.Sound.createAsync(source);
        soundRef.current = sound;

        await new Promise<void>((resolve) => {
          sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
            if (status.isLoaded && status.didJustFinish) {
              resolve();
            }
          });
          sound.playAsync();
        });

        // 2-second pause after audio finishes
        await new Promise<void>((resolve) => setTimeout(resolve, POST_AUDIO_PAUSE));
      } catch {
        // audio failed, caller falls back to timed duration
      }
    },
    [audioMap, cleanup],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return { playStep, cleanup };
}
