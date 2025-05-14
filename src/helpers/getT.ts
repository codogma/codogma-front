import { getIntl } from '@/helpers/getCookies';

export const getT = async (key: string, ns?: string): Promise<string> => {
  const lang = await getIntl();
  const { t } = await getT(lang, ns);
  return t(key);
};
