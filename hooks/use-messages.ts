import { useMemo } from 'react';
import { t as translate, Language, MessageKey } from '@/lib/messages';

export type TFunction = (key: MessageKey, params?: Record<string, string | number>) => string;

export function useMessages(language: Language): TFunction {
  return useMemo(
    () => (key: MessageKey, params?: Record<string, string | number>) =>
      translate(language, key, params),
    [language]
  );
}
