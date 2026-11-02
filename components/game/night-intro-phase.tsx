import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GameState, GameAction } from '@/lib/game-types';
import { getNarration } from '@/lib/narration';
import { Palermo, PalermoFonts } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { FadeView } from '@/components/ui/fade-view';
import { TFunction } from '@/hooks/use-messages';
import { useNarrationAudio } from '@/hooks/use-narration-audio';

interface NightIntroPhaseProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  t: TFunction;
}

interface NarrationStep {
  text: string;
  duration: number; // fallback seconds, 0 = manual advance
  audioKey?: string;
}

function buildSteps(loversEnabled: boolean, language: 'el' | 'en'): NarrationStep[] {
  const narration = getNarration(language);
  const steps: NarrationStep[] = [
    { text: narration.nightFalls, duration: 4, audioKey: 'nightFalls' },
    { text: narration.killersWake, duration: 10, audioKey: 'killersWake' },
    { text: narration.closeEyes, duration: 3, audioKey: 'closeEyes' },
    { text: narration.detectiveWake, duration: 8, audioKey: 'detectiveWake' },
    { text: narration.everyoneCloseEyes, duration: 3, audioKey: 'everyoneCloseEyes' },
  ];

  if (loversEnabled) {
    steps.push(
      { text: narration.loversWake, duration: 10, audioKey: 'loversWake' },
      { text: narration.closeEyes, duration: 3, audioKey: 'closeEyes' },
    );
  }

  steps.push({ text: narration.dawnBreaks, duration: 0, audioKey: 'dawnBreaks' });
  return steps;
}

export function NightIntroPhase({ state, dispatch, t }: NightIntroPhaseProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const steps = buildSteps(state.settings.loversEnabled, state.settings.language);
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const { playStep, cleanup } = useNarrationAudio(state.settings.language);
  const cancelledRef = useRef(false);

  const advance = useCallback(() => {
    if (isLast) {
      dispatch({ type: 'FINISH_NIGHT_INTRO' });
      return;
    }
    setFadeIn(false);
    setTimeout(() => {
      setStepIndex((i) => i + 1);
      setFadeIn(true);
    }, 400);
  }, [isLast, dispatch]);

  useEffect(() => {
    cancelledRef.current = false;

    if (step.duration === 0) {
      // Manual step: play audio but don't auto-advance
      if (step.audioKey) playStep(step.audioKey);
      return;
    }

    if (step.audioKey) {
      // Audio-driven advance
      playStep(step.audioKey).then(() => {
        if (!cancelledRef.current) advance();
      });
    } else {
      // Fallback to timed advance
      const timer = setTimeout(advance, step.duration * 1000);
      return () => clearTimeout(timer);
    }

    return () => {
      cancelledRef.current = true;
      cleanup();
    };
  }, [stepIndex, step.duration, step.audioKey, advance, playStep, cleanup]);

  return (
    <View style={styles.container}>
      <FadeView visible={fadeIn} duration={400} style={styles.center}>
        <Text style={styles.narration}>{step.text}</Text>
        {step.duration === 0 && (
          <View style={styles.buttonContainer}>
            <Button title={t('narration.beginVoting')} onPress={advance} />
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
