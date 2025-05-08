export function getNumber(key: string, fallback: number): number {
  if (typeof window === 'undefined') return fallback;
  const record = localStorage.getItem(key);
  if (record === null) {
    localStorage.setItem(key, String(fallback));
    return fallback;
  }
  const v = Number(localStorage.getItem(key));
  return isNaN(v) ? fallback : v;
}

export function getBoolean(key: string, fallback: boolean): boolean {
  if (typeof window === 'undefined') return fallback;
  const v = localStorage.getItem(key);
  return v === 'true' ? true : fallback;
}

export function getString(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const v = localStorage.getItem(key);
  return v ?? fallback;
}
