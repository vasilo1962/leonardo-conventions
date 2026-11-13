import { createContext, useContext, useState, useSyncExternalStore } from 'react';
import usePlayerLanguage from '@/hooks/use-player-language';
import {
  getPlayerInfoLanguage, hasPlayerInfoLanguagePreference, INFO_LANGUAGES, type InfoLanguage,
} from '@/lib/info-popup-translations';

export const ConventionsLanguageContext = createContext<{
  language: InfoLanguage;
  selectLanguage: (language: InfoLanguage) => void;
}>({ language: 'el', selectLanguage: () => undefined });

export function usePublicDocumentLanguage() {
  return useContext(ConventionsLanguageContext);
}

const LANGUAGE_STORAGE_KEY = 'leonardo-conventions-language';

function subscribeInitialLanguage() {
  return () => undefined;
}

function getInitialLanguage(): InfoLanguage {
  const playerLanguage = getPlayerInfoLanguage();
  if (hasPlayerInfoLanguagePreference()) return playerLanguage;
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && (INFO_LANGUAGES as readonly string[]).includes(saved)) return saved as InfoLanguage;
  } catch { /* Χρησιμοποιείται η γλώσσα του παίκτη. */ }
  return playerLanguage;
}

function createInitialLanguageSnapshot() {
  let initial: InfoLanguage | null = null;
  return () => initial ??= getInitialLanguage();
}

function getServerLanguage(): InfoLanguage {
  return 'el';
}

export function usePublicDocumentLanguageState() {
  const { language: playerLanguage, revision } = usePlayerLanguage();
  const [getLanguageSnapshot] = useState(createInitialLanguageSnapshot);
  const initialLanguage = useSyncExternalStore(subscribeInitialLanguage, getLanguageSnapshot, getServerLanguage);
  const [selection, setSelection] = useState<{ revision: number; language: InfoLanguage | null }>({ revision, language: null });
  const language = selection.revision === revision
    ? selection.language ?? (hasPlayerInfoLanguagePreference() ? playerLanguage : initialLanguage)
    : playerLanguage;
  const selectLanguage = (next: InfoLanguage) => {
    setSelection({ revision, language: next });
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch { /* Η επιλογή παραμένει διαθέσιμη χωρίς αποθήκευση στον browser. */ }
  };
  return { language, selectLanguage };
}
