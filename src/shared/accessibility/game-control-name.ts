import type { InfoLanguage } from '@/lib/info-popup-translations';
import { getAuthCopy } from '@/lib/auth-translations';
import { getGamePopupCopy } from '@/lib/game-popup-translations';
import { getResultsCopy } from '@/lib/results-translations';
import { getDuelDashboardCopy } from '@/lib/duel-translations';
import { getOpenTableInvitationCopy } from '@/lib/open-table-invitation-translations';
import { getGameControlSpeechCopy } from './game-control-speech-translations';
import { menuControlName } from './menu-accessibility';

// Only fixed interface labels are translated. Player text and contract labels pass through.
export function gameControlName(label: string, language: InfoLanguage): string {
  const key = label.replace(/\s+/g, ' ').trim().toUpperCase();
  const copy = getGameControlSpeechCopy(language);
  const results = getResultsCopy(language);
  switch (key) {
    case 'UNDO': return copy.undo;
    case 'RESTART DEAL': return copy.restart;
    case 'CHOOSE ANOTHER DEAL': case 'ΆΛΛΗ ΔΙΑΝΟΜΉ': return copy.chooseDeal;
    case 'RETRY': return results.retry;
    case 'TAP TO RETRY': return results.tapRetry;
    case 'CONTINUE': return getAuthCopy(language).continue;
    case 'RESULTS': case 'VIEW RESULTS': return getDuelDashboardCopy(language).viewResults;
    case 'BACK TO RESULTS': return results.backResults;
    case 'BACK': case 'ΠΊΣΩ': return getAuthCopy(language).back;
    case 'BACK TO MENU': return copy.backMenu;
    case 'ACCEPT CHALLENGE': return copy.acceptChallenge;
    case 'CLOSE': return results.close;
    case '← EXIT': case 'EXIT': return getGamePopupCopy(language).exit;
    case 'TOURNAMENTS': case 'TABLES': case 'CHALLENGE': case 'PRACTICE':
    case 'REMEMBER': case 'COUNT': return menuControlName(key, language);
    case 'VIEW CHALLENGES': case 'VIEW DUELS': return menuControlName('CHALLENGE', language);
    case 'CLAIM': return copy.claim;
    case 'INVITE PLAYER': return copy.invite;
    case 'ADD ROBOT': return copy.addRobot;
    case 'COPY LINK': return getOpenTableInvitationCopy(language).copyLink;
    case 'CANCEL INVITATION': return copy.cancelInvitation;
    case 'CANCEL': return getGamePopupCopy(language).cancel;
    case 'START': return copy.start;
    case 'PLAY AGAIN': return copy.again;
    case 'ΠΊΣΩ ΣΤΑ ΤΑΥΤΌΧΡΟΝΑ': return copy.simultaneous;
    default: return label.replace(/\n/g, ' ');
  }
}

