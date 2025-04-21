import { defaultNS, fallbackLng, languages } from '@/constants/i18n';
import { Language } from '@/types';

export function getOptions(
  lng: Language = fallbackLng,
  ns: string = defaultNS,
) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
