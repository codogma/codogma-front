import { Language } from '@/types';

export const fallbackLng: Language = Language.EN;
export const languages: string[] = Object.values(Language);
export const defaultNS: string = 'common';
export const intlCookie: string = 'intl';
export const contlCookie: string = 'contl';
export const languageMenuItems: { value: Language; label: string }[] = [
  {
    value: Language.EN,
    label: 'English',
  },
  {
    value: Language.RU,
    label: 'Русский',
  },
];
