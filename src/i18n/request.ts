import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { getLocale } from '@/helpers/getLocale';

import { routing } from './routing';

type Messages = Record<string, unknown>;

export default getRequestConfig(async () => {
  // Typically corresponds to the `[locale]` segment
  const requested = await getLocale();
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const mod: unknown = await import(`./messages/${locale}.json`);
  const messages = (mod as { default: Messages }).default;

  return { locale, messages };
});
