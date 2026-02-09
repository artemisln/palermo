import en from '@/assets/messages/en.json';
import el from '@/assets/messages/el.json';

export type Language = 'el' | 'en';
export type MessageKey = keyof typeof en;

const messages: Record<Language, Record<string, string>> = { en, el };

export function t(
  language: Language,
  key: MessageKey,
  params?: Record<string, string | number>
): string {
  let text = messages[language]?.[key] ?? messages.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return text;
}
