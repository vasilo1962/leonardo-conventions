// Vasilo represents an ordinary player in England with an English browser.
// Language detection starts in English; explicit language choices remain unrestricted.
// This environment grants no tester, supporter or other permissions.
const ENGLISH_PREVIEW_ACCOUNT_ID = 'b15daf60-598b-47e9-a8d6-cb03ff60a758';
let englishPreview = false;
let revision = 0;
const listeners = new Set<() => void>();

export const getEnglishAccountPreview = () => englishPreview;
export const getAccountPresentationRevision = () => revision;
export const getServerEnglishAccountPreview = () => false;

export function setActivePresentationAccount(userId: string | null) {
  const next = userId === ENGLISH_PREVIEW_ACCOUNT_ID;
  if (next === englishPreview) return;
  englishPreview = next;
  revision += 1;
  listeners.forEach(listener => listener());
}

export function subscribeAccountPresentation(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
