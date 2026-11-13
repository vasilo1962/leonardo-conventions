import { useEffect, type RefObject } from 'react';
import type { InfoLanguage } from '@/lib/info-popup-translations';

export default function useInfoMessageReading(
  messageRef: RefObject<unknown>, visible: boolean, enabled: boolean,
  message: string, language: InfoLanguage, restoreFocus = true, delayMs = 200
) {
  useEffect(() => {
    const node = messageRef.current;
    if (!visible || !enabled || typeof HTMLElement === 'undefined'
      || !(node instanceof HTMLElement)) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    let lastFocus = document.activeElement;
    const trackFocus = (event: FocusEvent) => { lastFocus = event.target as Element | null; };
    document.addEventListener('focusin', trackFocus);
    const timer = setTimeout(() => {
      if (!node.isConnected) return;
      node.setAttribute('lang', language);
      node.focus({ preventScroll: true });
    }, delayMs);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('focusin', trackFocus);
      const retainedFocus = document.activeElement === node
        || (document.activeElement === document.body && lastFocus === node);
      if (restoreFocus && retainedFocus && previousFocus?.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [messageRef, visible, enabled, message, language, restoreFocus, delayMs]);
}
