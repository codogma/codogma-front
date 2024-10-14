'use client';
import { use } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
} from 'react-i18next';

import { intlCookie } from '@/constants/i18n';

import { getOptions } from './settings';

use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    ...getOptions(),
    lng: undefined,
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: [],
  });

export function useTranslation(
  lng: string,
  ns?: string | string[],
  options: { keyPrefix?: string } = {},
) {
  const { t, i18n } = useTranslationOrg(ns, options);

  const [activeLng, setActiveLng] = useState<string | undefined>(
    i18n.resolvedLanguage,
  );

  useEffect(() => {
    if (i18n.resolvedLanguage !== lng) {
      i18n.changeLanguage(lng);
    }
  }, [lng, i18n]);

  useEffect(() => {
    if (activeLng !== i18n.resolvedLanguage) {
      setActiveLng(i18n.resolvedLanguage);
    }
  }, [activeLng, i18n.resolvedLanguage]);

  useEffect(() => {
    const cookieLng = Cookies.get(intlCookie);
    if (cookieLng !== lng) {
      Cookies.set(intlCookie, lng, { path: '/' });
    }
  }, [lng]);

  return { t, i18n };
}
