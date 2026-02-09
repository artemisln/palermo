import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GameState, GameAction } from '@/lib/game-types';
import { getNarration } from '@/lib/narration';
import { Palermo, PalermoFonts } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { FadeView } from '@/components/ui/fade-view';
import { PlayerList } from './player-list';
import { TFunction } from '@/hooks/use-messages';

interface NightKillPhaseProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  t: TFunction;
}

type SubPhase = 'NARRATION' | 'SELECT_VICTIM';

interface NarrationStep {
  text: string;
  duration: number; // 0 = manual
}

function buildNightSteps(state: GameState): NarrationStep[] {
  const narration = getNarration(state.settings.language);
  const steps: NarrationStep[] = [
    { text: narration.nightAgain, duration: 4 },
    { text: narration.killersChoose, duration: 0 },
  ];

  const doctorAlive = state.players.some(
    (p) => p.role === 'DOCTOR' && p.alive
  );
  const informantAlive = state.players.some(
    (p) => p.role === 'INFORMANT' && p.alive
  );

  if (state.settings.doctorEnabled && doctorAlive) {
    steps.push(
      { text: narration.doctorWake, duration: 10 },
      { text: narration.doctorSleep, duration: 3 },
    );
  }

  if (state.settings.informantEnabled && informantAlive) {
    steps.push(
      { text: narration.informantWake, duration: 8 },
      { text: narration.informantSleep, duration: 3 },
    );
  }

  return steps;
}

export function NightKillPhase({ state, dispatch, t }: NightKillPhaseProps) {
  const [subPhase, setSubPhase] = useState<SubPhase>('NARRATION');
  const [stepIndex, setStepIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [selectedVictimId, setSelectedVictimId] = useState<string | null>(null);
  const [doctorSaved, setDoctorSaved] = useState(false);

  const narration = getNarration(state.settings.language);
  const steps = buildNightSteps(state);
  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const advance = useCallback(() => {
    if (isLastStep) {
      setSubPhase('SELECT_VICTIM');
      return;
    }
    setFadeIn(false);
    setTimeout(() => {
      setStepIndex((i) => i + 1);
      setFadeIn(true);
    }, 400);
  }, [isLastStep]);

  useEffect(() => {
    if (subPhase !== 'NARRATION') return;
    if (!step || step.duration === 0) return;
    const timer = setTimeout(advance, step.duration * 1000);
    return () => clearTimeout(timer);
  }, [stepIndex, step, advance, subPhase]);

  if (subPhase === 'SELECT_VICTIM') {
    return (
      <View style={styles.container}>
        <Text style={styles.phase}>{t('night.phase')}</Text>
        <Text style={styles.title}>{narration.whoWasKilled}</Text>
        <Text style={styles.subtitle}>
          {t('night.selectVictim')}
        </Text>

        <View style={styles.listContainer}>
          <PlayerList
            players={state.players}
            t={t}
            aliveOnly
            selectable
            selectedId={selectedVictimId}
            onSelect={setSelectedVictimId}
          />
        </View>

        {state.settings.doctorEnabled && (
          <Pressable
            onPress={() => setDoctorSaved(!doctorSaved)}
            style={styles.checkboxRow}
          >
            <View style={[styles.checkbox, doctorSaved && styles.checkboxActive]}>
              {doctorSaved && <Text style={styles.checkMark}>&#10003;</Text>}
            </View>
            <Text style={styles.checkboxLabel}>{t('night.doctorSaved')}</Text>
          </Pressable>
        )}

        <View style={styles.footer}>
          <Button
            title={
              doctorSaved
                ? t('night.noOneDied')
                : selectedVictimId
                  ? t('night.confirmKill')
                  : t('night.noOneDiedTonight')
            }
            onPress={() =>
              dispatch({
                type: 'ANNOUNCE_VICTIM',
                victimId: selectedVictimId,
                doctorSaved,
              })
            }
            variant={selectedVictimId && !doctorSaved ? 'danger' : 'primary'}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FadeView visible={fadeIn} duration={400} style={styles.center}>
        <Text style={styles.narration}>{step?.text}</Text>
        {step?.duration === 0 && (
          <View style={styles.buttonContainer}>
            <Button title={t('common.continue')} onPress={advance} />
          </View>
        )}
      </FadeView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    justifyContent: 'center',
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
  phase: {
    color: Palermo.danger,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    color: Palermo.text,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: PalermoFonts?.title,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: Palermo.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Palermo.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    borderColor: Palermo.accent,
    backgroundColor: Palermo.accentMuted,
  },
  checkMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxLabel: {
    color: Palermo.textMuted,
    fontSize: 14,
  },
  footer: {
    paddingTop: 16,
  },
});
