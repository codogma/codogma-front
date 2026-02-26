/**
 * Определяет платформу пользователя на основе User-Agent
 */
export function detectPlatform(userAgent: string): 'mac' | 'other' {
  const ua = userAgent.toLowerCase();
  const isMac =
    ua.includes('macintosh') ||
    ua.includes('mac os') ||
    /iPad|iPhone|iPod/.test(userAgent);
  return isMac ? 'mac' : 'other';
}
