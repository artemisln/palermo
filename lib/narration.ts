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

export function getNarration(language: Language): NarrationKeys {
  const result = {} as NarrationKeys;
  for (const [key, msgKey] of Object.entries(NARRATION_MAP)) {
    (result as Record<string, string>)[key] = t(language, msgKey);
  }
  return result;
}
