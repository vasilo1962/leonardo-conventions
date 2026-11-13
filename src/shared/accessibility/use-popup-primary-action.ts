import { useLayoutEffect, type RefObject } from 'react';
import { getPlayerInfoLanguage, type InfoLanguage } from '@/lib/info-popup-translations';
import { popupAnnouncementContent } from '@/shared/accessibility/table-announcements';
import { popupActionInstruction, popupPrimaryAction } from './popup-primary-action';
import { useVoiceMode } from './voice-mode';

const overlays: HTMLElement[] = [];
export default function usePopupPrimaryAction(hostRef: RefObject<HTMLElement | null>,
 announcement?: { text: string; language: InfoLanguage; instruction?: string },
 readPrimaryAction = true
) {
 const suppliedText = announcement?.text;
 const suppliedLanguage = announcement?.language;
 const suppliedInstruction = announcement?.instruction;
 const { enabled } = useVoiceMode();
 useLayoutEffect(() => {
  const root = hostRef.current;
  if (!root || typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;
  overlays.push(root);
  const previousFocus = document.activeElement as HTMLElement | null;
  let button: HTMLElement | null = null;
  let originalLabel: string | null = null;
  let installedLabel: string | null = null;
  let signature = '';
  let readingOwner: HTMLElement | null = null;
  let timer: ReturnType<typeof setTimeout>;
  const surfaces = new Map<HTMLElement, {
   role: string | null; live: string | null;
  }>();
  const restoreSurfaces = () => {
   root.removeAttribute('data-popup-reading-owner');
   for (const [element, saved] of surfaces) {
    if (element.getAttribute('role') === 'presentation') {
     if (saved.role === null) element.removeAttribute('role');
     else element.setAttribute('role', saved.role);
    }
    if (element.getAttribute('aria-live') === 'off') {
     if (saved.live === null) element.removeAttribute('aria-live');
     else element.setAttribute('aria-live', saved.live);
    }
   }
   surfaces.clear();
   readingOwner = null;
  };
  const restoreLabel = () => {
   if (button && button.getAttribute('aria-label') === installedLabel) {
    if (originalLabel === null) button.removeAttribute('aria-label');
    else button.setAttribute('aria-label', originalLabel);
   }
  };
  const readingSurface = () => {
   const action = popupPrimaryAction(root);
   const retained = readingOwner && popupPrimaryAction(root, true) === readingOwner;
   if (overlays.at(-1) !== root || !enabled || !readPrimaryAction || (!action && !retained)) {
    restoreSurfaces();
    return;
   }
   readingOwner = action ?? readingOwner;
   // Keep ownership while the selected action is temporarily disabled.
   root.setAttribute('data-popup-reading-owner', 'primary-action');
   // Disable competing live paths before paint; the focused action owns this message.
   for (const element of root.querySelectorAll<HTMLElement>(
    '[role="alert"], [role="status"], [role="log"], [aria-live="polite"], [aria-live="assertive"]'
   )) {
    if (!surfaces.has(element)) surfaces.set(element, {
     role: element.getAttribute('role'), live: element.getAttribute('aria-live'),
    });
    if (element.matches('[role="alert"], [role="status"], [role="log"]')) {
     element.setAttribute('role', 'presentation');
    }
    element.setAttribute('aria-live', 'off');
   }
  };
  const update = () => {
   if (overlays.at(-1) !== root) return;
   readingSurface();
   const next = popupPrimaryAction(root)
    ?? (popupPrimaryAction(root, true) === readingOwner ? readingOwner : null);
   if (next !== button) { restoreLabel(); button = next; originalLabel = next?.getAttribute('aria-label') ?? null; signature = ''; }
   if (!enabled || !readPrimaryAction || !button || !popupPrimaryAction(root)) return;
   const { text, language } = suppliedText === undefined
    ? popupAnnouncementContent(root, getPlayerInfoLanguage())
    : { text: suppliedText, language: suppliedLanguage ?? getPlayerInfoLanguage() };
   const touch = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
   const nextSignature = `${language}:${text}:${suppliedInstruction ?? ''}`;
   if (signature === nextSignature) return;
   signature = nextSignature;
   installedLabel = `${text} ${suppliedInstruction ?? popupActionInstruction(language, touch)}`;
   button.setAttribute('aria-label', installedLabel);
   button.setAttribute('lang', language);
   button.focus({ preventScroll: true });
  };
  const schedule = () => {
   readingSurface();
   clearTimeout(timer);
   timer = setTimeout(update, 220);
  };
  const observer = new MutationObserver(schedule);
  observer.observe(root, { childList: true, characterData: true, subtree: true });
  schedule();
  const keydown = (event: KeyboardEvent) => {
   if (overlays.at(-1) !== root || event.key !== 'Enter' || event.defaultPrevented || event.repeat || event.isComposing
    || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
   const action = popupPrimaryAction(root);
   if (!action) return;
   const active = document.activeElement;
   if (active?.matches('input, textarea, select, [contenteditable="true"], [role="textbox"]')) return;
   if (active instanceof HTMLElement && root.contains(active) && active.closest('button, [role="button"], a, [role="link"]') && active !== action) return;
   event.preventDefault();
   event.stopPropagation();
   action.click();
  };
  document.addEventListener('keydown', keydown, true);
  return () => {
   observer.disconnect(); clearTimeout(timer); restoreLabel(); restoreSurfaces();
   document.removeEventListener('keydown', keydown, true);
   overlays.splice(overlays.indexOf(root), 1);
   if (button === document.activeElement && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  };
 }, [enabled, hostRef, suppliedText, suppliedLanguage, suppliedInstruction, readPrimaryAction]);
}
