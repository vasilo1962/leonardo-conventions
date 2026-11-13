// Necessary eligibility check only; no identifiers, cookies, storage or country history.
export type AdCountry = 'unknown' | 'eligible' | 'ineligible';
let country: AdCountry = 'unknown';
let pending: Promise<boolean> | null = null;
const listeners = new Set<() => void>();

export const getAdCountry = (): AdCountry => country;
export function subscribeAdCountry(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

// One same-origin check per document. Never reuse an eligibility decision from
// storage or another page load/IP. Failure remains disabled until a new load.
export function resolveAdCountry(): Promise<boolean> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return Promise.resolve(false);
  if (pending) return pending;
  pending = (async () => {
    let eligible = false;
    try {
      const response = await fetch('/api/ads/eligibility', {
        cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer',
        redirect: 'error', signal: AbortSignal.timeout(4000),
      });
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const result: unknown = await response.json();
        eligible = typeof result === 'object' && result !== null
          && 'eligible' in result && result.eligible === true;
      }
    } catch { /* Unknown IP, offline, timeout and deployment gaps all disable Ads. */ }
    country = eligible ? 'eligible' : 'ineligible';
    listeners.forEach(listener => listener());
    return eligible;
  })();
  return pending;
}
