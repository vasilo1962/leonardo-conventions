import { resolveAdCountry } from './ad-country';

// Necessary preference storage only. Advertising identifiers live separately.
const KEY = 'leonardobridge:measurement-consent';
export const CONSENT_CHANGED = 'leonardo-measurement-consent';
export const CONSENT_SETTINGS = 'leonardo-measurement-settings';
export const CONSENT_DURATION = 180 * 24 * 60 * 60 * 1000;
export type MeasurementConsent = 'accepted' | 'rejected' | 'unknown';
let memory: { choice: MeasurementConsent; expires: number } | null = null;

export function getMeasurementConsent(): MeasurementConsent {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 'unknown';
  if (memory && memory.expires > Date.now()) return memory.choice;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return memory && memory.expires > Date.now() ? memory.choice : 'unknown';
    const value = JSON.parse(raw);
    return value.version === 1 && value.expires > Date.now()
      && (value.choice === 'accepted' || value.choice === 'rejected')
      ? value.choice : 'unknown';
  } catch { return memory && memory.expires > Date.now() ? memory.choice : 'unknown'; }
}

export function hasMeasurementConsent() { return getMeasurementConsent() === 'accepted'; }

export function hasMeasurementDecision() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try { return Boolean(memory || window.localStorage.getItem(KEY)); } catch { return Boolean(memory); }
}

export function setMeasurementConsent(choice: 'accepted' | 'rejected') {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  memory = { choice, expires: Date.now() + CONSENT_DURATION };
  try { window.localStorage.setItem(KEY, JSON.stringify({ ...memory, version: 1 })); }
  catch {
    // A full storage area may allow removal but reject replacement. Never leave
    // an older acceptance behind after a failed attempt to save rejection.
    try { window.localStorage.removeItem(KEY); } catch { /* In-memory choice still applies. */ }
  }
  window.dispatchEvent(new Event(CONSENT_CHANGED));
}

export function subscribeMeasurementConsent(listener: () => void) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => undefined;
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) { memory = null; listener(); }
  };
  window.addEventListener(CONSENT_CHANGED, listener);
  window.addEventListener('storage', onStorage);
  window.addEventListener('focus', listener);
  return () => {
    window.removeEventListener(CONSENT_CHANGED, listener);
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('focus', listener);
  };
}

export async function openMeasurementSettings() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined' && await resolveAdCountry()) {
    window.dispatchEvent(new Event(CONSENT_SETTINGS));
  }
}
