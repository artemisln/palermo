import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GameState, GameAction } from '@/lib/game-types';
import { Narration } from '@/lib/narration';
import { Palermo, PalermoFonts } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { FadeView } from '@/components/ui/fade-view';

interface NightIntroPhaseProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

interface NarrationStep {
  text: string;
  duration: number; // seconds, 0 = manual advance
}

function buildSteps(loversEnabled: boolean): NarrationStep[] {
  const steps: NarrationStep[] = [
    { text: Narration.nightFalls, duration: 4 },
    { text: Narration.killersWake, duration: 10 },
    { text: Narration.closeEyes, duration: 3 },
    { text: Narration.detectiveWake, duration: 8 },
    { text: Narration.everyoneCloseEyes, duration: 3 },
  ];

  if (loversEnabled) {
    steps.push(
      { text: Narration.loversWake, duration: 10 },
      { text: Narration.closeEyes, duration: 3 },
    );
  }

  steps.push({ text: Narration.dawnBreaks, duration: 0 });
  return steps;
}

export function NightIntroPhase({ state, dispatch }: NightIntroPhaseProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const steps = buildSteps(state.settings.loversEnabled);
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

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
    if (step.duration === 0) return;
    const timer = setTimeout(advance, step.duration * 1000);
    return () => clearTimeout(timer);
  }, [stepIndex, step.duration, advance]);

  return (
    <View style={styles.container}>
      <FadeView visible={fadeIn} duration={400} style={styles.center}>
        <Text style={styles.narration}>{step.text}</Text>
        {step.duration === 0 && (
          <View style={styles.buttonContainer}>
            <Button title="Begin Discussion" onPress={advance} />
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
