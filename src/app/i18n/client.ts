'use client';
import Cookies from 'js-cookie';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { intlCookie } from '@/constants/i18n';
import { Language } from '@/types';

import i18next from './i18next';

export function useT(
  ns?: string | string[],
  options: { keyPrefix?: string } = {},
) {
  const { lng } = useParams<{ lng: Language }>();
  const { t } = useTranslation(ns, options);

  const [activeLng, setActiveLng] = useState<string | undefined>(
    i18next.resolvedLanguage,
  );

  useEffect(() => {
    if (i18next.resolvedLanguage !== lng) {
      i18next.changeLanguage(lng);
    }
  }, [lng]);

  useEffect(() => {
    if (activeLng !== i18next.resolvedLanguage) {
      setActiveLng(i18next.resolvedLanguage);
    }
  }, [activeLng]);

  useEffect(() => {
    const cookieLng = Cookies.get(intlCookie);
    if (cookieLng !== lng) {
      Cookies.set(intlCookie, lng, { path: '/' });
    }
  }, [lng]);

  return { t, i18next };
}
