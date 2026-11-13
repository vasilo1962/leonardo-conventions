import { canFocusHoveredControl } from './hover-control-state';
import { getPlayerInfoLanguage, type InfoLanguage } from '@/lib/info-popup-translations';

// Exploration reads the control itself without a live notification.
export function focusHoveredMenuControl(event: { currentTarget: unknown }, language: InfoLanguage = getPlayerInfoLanguage(), allowDisabled = false) {
  if (typeof HTMLElement === 'undefined' || !(event.currentTarget instanceof HTMLElement)) return;
  const element = event.currentTarget;
  if (!canFocusHoveredControl(element, allowDisabled)) return;
  element.setAttribute('lang', language);
  if (document.activeElement !== element) element.focus({ preventScroll: true });
}
