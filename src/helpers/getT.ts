import { initTranslation } from '@/app/i18n';
import { getIntl } from '@/helpers/getCookies';

export const getT = async (key: string, ns?: string): Promise<string> => {
  const lang = await getIntl();
  const { t } = await initTranslation(lang, ns);
  return t(key);
};
