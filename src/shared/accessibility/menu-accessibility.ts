import { getPracticeMenuCopy, PRACTICE_JUST_DECLARE_TITLE, PRACTICE_BID_AND_PLAY_TITLE } from '@/lib/practice-menu-copy';
import type { InfoLanguage } from '@/lib/info-popup-translations';
import { getResultsCopy } from '@/lib/results-translations';
import { getStatisticsCopy } from '@/lib/statistics-translations';
import { getInterfaceSpeechCopy } from './interface-speech-translations';
import { menuPageTitle } from './navigation-speech-translations';

const pages: Record<string,string> = {
  TOURNAMENTS:'tournaments', TABLES:'tables', CHALLENGE:'duels', PRACTICE:'play',
  REMEMBER:'remember', COUNT:'count', federation:'federation-deals',
};
export function menuControlName(title: string, language: InfoLanguage): string {
  const practice = getPracticeMenuCopy(language);
  if (title === 'PARTNERSHIP PRACTICE') return practice.partnership;
  if (title === PRACTICE_JUST_DECLARE_TITLE) return `${practice.solo}. ${practice.justDeclare}`;
  if (title === PRACTICE_BID_AND_PLAY_TITLE) return `${practice.solo}. ${practice.bidAndPlay}`;
  if (title === 'RESULTS') return getResultsCopy(language).title;
  if (title === 'STATISTICS') return getStatisticsCopy(language).title;
  if (title === 'ADD A DEAL') return getInterfaceSpeechCopy(language).addDeal;
  return menuPageTitle(pages[title] ?? title, language) ?? title;
}
