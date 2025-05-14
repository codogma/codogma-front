import { i18n } from 'i18next';

import { getLocale } from '@/helpers/getLocale';

import i18next from './i18next';

export async function getT(
  ns?: string | string[],
  options: { keyPrefix?: string } = {},
): Promise<{
  t: (key: string, options?: never) => string;
  i18n: i18n;
}> {
  const lng = await getLocale();
  if (lng && i18next.resolvedLanguage !== lng) {
    await i18next.changeLanguage(lng);
  }
  if (ns && !i18next.hasLoadedNamespace(ns)) {
    await i18next.loadNamespaces(ns);
  }
  return {
    t: i18next.getFixedT(
      lng ?? i18next.resolvedLanguage,
      Array.isArray(ns) ? ns[0] : ns,
      options.keyPrefix,
    ),
    i18n: i18next,
  };
}
