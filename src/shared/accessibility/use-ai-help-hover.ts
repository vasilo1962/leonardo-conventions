import { canFocusHoveredControl } from './hover-control-state';
import { useEffect, type RefObject } from 'react';
import type { InfoLanguage } from '@/lib/info-popup-translations';

// Mouse exploration focuses the existing reading surface, never a live region.
export default function useAiHelpHover(rootRef: RefObject<unknown>, visible: boolean, language: InfoLanguage) {
  useEffect(() => {
    const root = rootRef.current;
    if (!visible || typeof HTMLElement === 'undefined' || !(root instanceof HTMLElement)) return;
    const explore = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>(
        'input, textarea, button, [role="button"], a, [role="link"], [data-testid="ai-help-readable"]'
      );
      if (!element || !root.contains(element) || !canFocusHoveredControl(element)) return;
      const textLanguage = element.closest('[lang]')?.getAttribute('lang') ?? language;
      if (element.getAttribute('lang') !== textLanguage) element.setAttribute('lang', textLanguage);
      if (document.activeElement !== element) element.focus({ preventScroll: true });
    };
    root.addEventListener('mouseover', explore);
    root.addEventListener('pointerover', explore);
    root.addEventListener('mousemove', explore);
    return () => {
      root.removeEventListener('mouseover', explore);
      root.removeEventListener('pointerover', explore);
      root.removeEventListener('mousemove', explore);
    };
  }, [rootRef, visible, language]);
}
