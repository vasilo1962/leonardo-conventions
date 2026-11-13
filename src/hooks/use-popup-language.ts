import { useState } from 'react';
import usePlayerLanguage from '@/hooks/use-player-language';

import {
  type InfoLanguage,
} from '@/lib/info-popup-translations';

export function usePopupLanguage(visible: boolean, preferredLanguage?: InfoLanguage) {
  const [showEnglish, setShowEnglish] = useState(false);

  const [previousVisible, setPreviousVisible] = useState(visible);
  if (previousVisible !== visible) {
    setPreviousVisible(visible);
    if (!visible) {
      setShowEnglish(false);
    }
  }

  const { language: selectedLanguage } = usePlayerLanguage();
  const playerLanguage = preferredLanguage ?? selectedLanguage;
  const language: InfoLanguage = showEnglish ? 'en' : playerLanguage;

  return {
    language,
    playerLanguage,
    showEnglish,
    toggleLanguage: () => setShowEnglish(value => !value),
  };
}

