import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { GameState, GameAction } from '@/lib/game-types';
import { getNarration, getNarrationAudio, NarrationAudioKey } from '@/lib/narration';
import { Palermo, PalermoFonts } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { FadeView } from '@/components/ui/fade-view';
import { TFunction } from '@/hooks/use-messages';

interface NightIntroPhaseProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  t: TFunction;
}

interface NarrationStep {
  text: string;
  audioKey: NarrationAudioKey;
  fallbackDuration: number; // seconds, 0 = manual advance
  manual?: boolean;
}

function buildSteps(loversEnabled: boolean, language: 'el' | 'en'): NarrationStep[] {
  const narration = getNarration(language);
  const steps: NarrationStep[] = [
    { text: narration.nightFalls, audioKey: 'nightFalls', fallbackDuration: 4 },
    { text: narration.killersWake, audioKey: 'killersWake', fallbackDuration: 10 },
    { text: narration.closeEyes, audioKey: 'closeEyes', fallbackDuration: 3 },
    { text: narration.detectiveWake, audioKey: 'detectiveWake', fallbackDuration: 8 },
    { text: narration.everyoneCloseEyes, audioKey: 'everyoneCloseEyes', fallbackDuration: 3 },
  ];

  if (loversEnabled) {
    steps.push(
      { text: narration.loversWake, audioKey: 'loversWake', fallbackDuration: 10 },
      { text: narration.closeEyes, audioKey: 'closeEyes', fallbackDuration: 3 },
    );
  }

  steps.push({
    text: narration.dawnBreaks,
    audioKey: 'dawnBreaks',
    fallbackDuration: 0,
    manual: true,
  });
  return steps;
}

export function NightIntroPhase({ state, dispatch, t }: NightIntroPhaseProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const steps = useMemo(
    () => buildSteps(state.settings.loversEnabled, state.settings.language),
    [state.settings.loversEnabled, state.settings.language]
  );
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const unloadSound = useCallback(async () => {
    const sound = soundRef.current;
    if (!sound) return;
    sound.setOnPlaybackStatusUpdate(null);
    soundRef.current = null;
    await sound.unloadAsync();
  }, []);

  const advance = useCallback(() => {
    if (isLast) {
      dispatch({ type: 'FINISH_NIGHT_INTRO' });
      return;
    }
    setFadeIn(false);
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    transitionTimerRef.current = setTimeout(() => {
      setStepIndex((i) => i + 1);
      setFadeIn(true);
    }, 400);
  }, [isLast, dispatch]);

  useEffect(() => {
    let active = true;

    const playStepAudio = async () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }

      setIsAudioPlaying(true);
      await unloadSound();

      try {
        const source = getNarrationAudio(state.settings.language, step.audioKey);
        const { sound } = await Audio.Sound.createAsync(source);
        if (!active) {
          await sound.unloadAsync();
          return;
        }

        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
          if (!active || !status.isLoaded) return;
          if (status.didJustFinish) {
            setIsAudioPlaying(false);
            if (!step.manual) {
              advance();
            }
          }
        });
        await sound.playAsync();
      } catch {
        setIsAudioPlaying(false);
        if (!step.manual && step.fallbackDuration > 0) {
          fallbackTimerRef.current = setTimeout(advance, step.fallbackDuration * 1000);
        }
      }
    };

    void playStepAudio();

    return () => {
      active = false;
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      void unloadSound();
    };
  }, [advance, step, state.settings.language, unloadSound]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
      void unloadSound();
    };
  }, [unloadSound]);

  return (
    <View style={styles.container}>
      <FadeView visible={fadeIn} duration={400} style={styles.center}>
        <Text style={styles.narration}>{step.text}</Text>
        {step.manual && (
          <View style={styles.buttonContainer}>
            <Button
              title={t('narration.beginDiscussion')}
              onPress={advance}
              disabled={isAudioPlaying}
            />
          </View>
        )}
      </FadeView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  center: {
    alignItems: 'center',
    width: '100%',
  },
  narration: {
    color: Palermo.text,
    fontSize: 28,
    fontWeight: '600',
    fontFamily: PalermoFonts?.title,
    textAlign: 'center',
    lineHeight: 40,
  },
  buttonContainer: {
    marginTop: 40,
    width: '100%',
  },
});
