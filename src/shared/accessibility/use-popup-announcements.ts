import { popupPrimaryAction } from './popup-primary-action';
import { useVoiceMode } from './voice-mode';
import { useContext, useEffect, type RefObject } from 'react';
import { TableAnnouncementContext, popupAnnouncementContent } from '@/shared/accessibility/table-announcements';

// The overlay owns visibility and animation; this adapter only reads its announced content.
export default function usePopupAnnouncements(
  hostRef: RefObject<HTMLElement | null>,
  animationType: 'none' | 'slide' | 'fade',
  announceContent: boolean
) {
  const { enabled } = useVoiceMode();
  const announcements = useContext(TableAnnouncementContext);
  useEffect(() => {
    const root = hostRef.current;
    if (!announceContent || !announcements || !root || typeof MutationObserver === 'undefined') return;
    let lastText = '';
    let lastLanguage = '';
    let timer: ReturnType<typeof setTimeout> | null = null;
    const read = () => {
      timer = null;
      if (enabled && (popupPrimaryAction(root)
        || root.getAttribute('data-popup-reading-owner') === 'primary-action')) return;
      // Preserve pop-ups that already announce their own content, including urgent alerts.
      if (root.querySelector('[role="alert"], [role="status"], [aria-live="polite"], [aria-live="assertive"]')) return;
      const { text, language } = popupAnnouncementContent(root, announcements.language);
      root.setAttribute('lang', language);
      if (!text || (text === lastText && language === lastLanguage)) return;
      lastText = text;
      lastLanguage = language;
      announcements.announce(text, language);
    };
    const schedule = () => {
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(read, animationType === 'fade' ? 200 : 0);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(root, { childList: true, characterData: true, subtree: true });
    schedule();
    return () => {
      observer.disconnect();
      if (timer !== null) clearTimeout(timer);
    };
  }, [enabled, announcements, animationType, announceContent, hostRef]);
}

