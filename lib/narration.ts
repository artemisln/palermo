import { t, Language, MessageKey } from './messages';

type NarrationKeys = {
  nightFalls: string;
  killersWake: string;
  closeEyes: string;
  detectiveWake: string;
  everyoneCloseEyes: string;
  loversWake: string;
  dawnBreaks: string;
  discuss: string;
  votePrompt: string;
  nightAgain: string;
  killersChoose: string;
  doctorWake: string;
  doctorSleep: string;
  informantWake: string;
  informantSleep: string;
  whoWasKilled: string;
  killBlocked: string;
  goodWins: string;
  killersWin: string;
  loversWin: string;
};

export type NarrationAudioKey =
  | 'nightFalls'
  | 'killersWake'
  | 'closeEyes'
  | 'detectiveWake'
  | 'everyoneCloseEyes'
  | 'loversWake'
  | 'dawnBreaks'
  | 'nightAgain'
  | 'killersChoose'
  | 'doctorWake'
  | 'doctorSleep'
  | 'informantWake'
  | 'informantSleep';

const NARRATION_MAP: Record<keyof NarrationKeys, MessageKey> = {
  nightFalls: 'narration.nightFalls',
  killersWake: 'narration.killersWake',
  closeEyes: 'narration.closeEyes',
  detectiveWake: 'narration.detectiveWake',
  everyoneCloseEyes: 'narration.everyoneCloseEyes',
  loversWake: 'narration.loversWake',
  dawnBreaks: 'narration.dawnBreaks',
  discuss: 'narration.discuss',
  votePrompt: 'narration.votePrompt',
  nightAgain: 'narration.nightAgain',
  killersChoose: 'narration.killersChoose',
  doctorWake: 'narration.doctorWake',
  doctorSleep: 'narration.doctorSleep',
  informantWake: 'narration.informantWake',
  informantSleep: 'narration.informantSleep',
  whoWasKilled: 'narration.whoWasKilled',
  killBlocked: 'narration.killBlocked',
  goodWins: 'end.goodWins',
  killersWin: 'end.killersWin',
  loversWin: 'end.loversWin',
};

const NARRATION_AUDIO: Record<Language, Record<NarrationAudioKey, number>> = {
  en: {
    nightFalls: require('@/assets/audio/en/night-falls.mp3'),
    killersWake: require('@/assets/audio/en/killers-wake.mp3'),
    closeEyes: require('@/assets/audio/en/close-eyes.mp3'),
    detectiveWake: require('@/assets/audio/en/detective-wake.mp3'),
    everyoneCloseEyes: require('@/assets/audio/en/everyone-close-eyes.mp3'),
    loversWake: require('@/assets/audio/en/lovers-wake.mp3'),
    dawnBreaks: require('@/assets/audio/en/dawn-breaks.mp3'),
    nightAgain: require('@/assets/audio/en/night-again.mp3'),
    killersChoose: require('@/assets/audio/en/killers-choose.mp3'),
    doctorWake: require('@/assets/audio/en/doctor-wake.mp3'),
    doctorSleep: require('@/assets/audio/en/doctor-sleep.mp3'),
    informantWake: require('@/assets/audio/en/informant-wake.mp3'),
    informantSleep: require('@/assets/audio/en/informant-sleep.mp3'),
  },
  el: {
    nightFalls: require('@/assets/audio/el/night-falls.mp3'),
    killersWake: require('@/assets/audio/el/killers-wake.mp3'),
    closeEyes: require('@/assets/audio/el/close-eyes.mp3'),
    detectiveWake: require('@/assets/audio/el/detective-wake.mp3'),
    everyoneCloseEyes: require('@/assets/audio/el/everyone-close-eyes.mp3'),
    loversWake: require('@/assets/audio/el/lovers-wake.mp3'),
    dawnBreaks: require('@/assets/audio/el/dawn-breaks.mp3'),
    nightAgain: require('@/assets/audio/el/night-again.mp3'),
    killersChoose: require('@/assets/audio/el/killers-choose.mp3'),
    doctorWake: require('@/assets/audio/el/doctor-wake.mp3'),
    doctorSleep: require('@/assets/audio/el/doctor-sleep.mp3'),
    informantWake: require('@/assets/audio/el/informant-wake.mp3'),
    informantSleep: require('@/assets/audio/el/informant-sleep.mp3'),
  },
};

export function getNarration(language: Language): NarrationKeys {
  const result = {} as NarrationKeys;
  for (const [key, msgKey] of Object.entries(NARRATION_MAP)) {
    (result as Record<string, string>)[key] = t(language, msgKey);
  }
  return result;
}

export function getNarrationAudio(language: Language, key: NarrationAudioKey): number {
  return NARRATION_AUDIO[language][key];
}
