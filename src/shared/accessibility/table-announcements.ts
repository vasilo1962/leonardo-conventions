import { Fragment, createContext, createElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Text as NativeText } from 'react-native';
import { useVoiceMode } from '@/shared/accessibility/voice-mode';
import type { InfoLanguage } from '@/lib/info-popup-translations';
import { canRecoverTableActionFocus } from './table-action-focus';
import TableActionReading from './table-action-reading';

export type TableAnnouncement = {
  id: number; text: string; language: InfoLanguage; recoverFocus?: boolean;
};
export type AnnounceTableText = (
  text: string, language?: InfoLanguage, options?: { recoverFocus?: boolean }
) => void;

export const TableAnnouncementContext = createContext<{
  announce: AnnounceTableText;
  language: InfoLanguage;
} | null>(null);

export function useTableAnnouncementLog(language: InfoLanguage) {
  const { enabled } = useVoiceMode();
  const queued = enabled && typeof document !== 'undefined';
  const queuedRef = useRef(queued);
  const [entries, setEntries] = useState<TableAnnouncement[]>([]);
  const [entryMode, setEntryMode] = useState(queued);
  if (entryMode !== queued) {
    setEntryMode(queued);
    setEntries([]);
  }
  const languageRef = useRef(language);
  useLayoutEffect(() => { languageRef.current = language; }, [language]);
  const sequence = useRef(0);
  const pending = useRef<TableAnnouncement[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generation = useRef(0);
  const clear = useCallback(() => {
    generation.current += 1;
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    pending.current = [];
    setEntries([]);
  }, []);
  useLayoutEffect(() => {
    queuedRef.current = queued;
    generation.current += 1;
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    pending.current = [];
  }, [queued]);
  const announce = useCallback<AnnounceTableText>((text, textLanguage, options) => {
    const clean = text.trim();
    if (!clean) return;
    pending.current.push({
      id: ++sequence.current, text: clean,
      language: textLanguage ?? languageRef.current,
      ...(options?.recoverFocus && pending.current.length === 0
        && queuedRef.current && typeof document !== 'undefined'
        && canRecoverTableActionFocus(document) ? { recoverFocus: true } : {}),
    });
    if (timer.current !== null) return;
    const currentGeneration = generation.current;
    // Voice Mode appends stable nodes so later updates do not replace queued speech.
    timer.current = setTimeout(() => {
      if (generation.current !== currentGeneration) return;
      timer.current = null;
      const batch = pending.current.splice(0);
      if (batch.length) setEntries(previous => queuedRef.current ? [...previous, ...batch] : batch);
    }, 0);
  }, []);
  useEffect(() => () => {
    generation.current += 1;
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    pending.current = [];
  }, []);
  return { entries, announce, clear };
}

export function TableAnnouncementLog({ entries }: { entries: TableAnnouncement[] }) {
  const { enabled } = useVoiceMode();
  const [liveFallbacks, setLiveFallbacks] = useState<Set<number>>(() => new Set());
  const recoverThroughLiveLog = useCallback((ids: number[]) => {
    setLiveFallbacks(previous => new Set([...previous, ...ids]));
  }, []);
  if (typeof document === 'undefined') {
    const latest = entries.at(-1);
    return createElement(NativeText, {
      accessibilityLiveRegion: 'assertive',
      accessibilityLanguage: latest?.language,
      pointerEvents: 'none',
      style: { position: 'absolute', opacity: 0 },
    }, latest ? entries.map(entry => entry.text).join('. ') + (latest.id % 2 ? '\u200b' : '\u200b\u200b') : '');
  }
  const liveLog = createElement('div', {
    role: enabled ? 'log' : 'status',
    'aria-live': enabled ? 'polite' : 'assertive',
    'aria-atomic': !enabled,
    'aria-relevant': enabled ? 'additions' : 'additions text',
    // Keep the log available to live announcements without covering the table's reading surface.
    style: {
      position: 'absolute', top: 0, left: 0,
      width: '1%', height: '1%', overflow: 'hidden',
      clipPath: 'inset(50%)', pointerEvents: 'none',
    },
  }, entries.filter(entry => !entry.recoverFocus || liveFallbacks.has(entry.id))
    .map(entry => createElement('div', {
    key: entry.id, lang: entry.language,
  }, entry.text)));
  const actionReader = createElement(TableActionReading, {
    enabled, entries, onLiveFallback: recoverThroughLiveLog,
  });
  return createElement(Fragment, null, liveLog, actionReader);

}

// Read only the visible popup content, never an input's draft or hidden text.
export function popupAnnouncementContent(root: HTMLElement, defaultLanguage: InfoLanguage) {
  const languageControl = Array.from(root.querySelectorAll('[role="button"], button'))
    .find(node => node.textContent?.includes('🌐'));
  const language = languageControl
    ? languageControl.textContent?.includes('ENGLISH') ? defaultLanguage : 'en'
    : defaultLanguage;
  const copy = root.cloneNode(true) as HTMLElement;
  copy.querySelectorAll('input, textarea, select, [aria-hidden="true"]').forEach(node => node.remove());
  const withoutControls = copy.cloneNode(true) as HTMLElement;
  withoutControls.querySelectorAll('[role="button"], button').forEach(node => node.remove());
  const collect = (element: HTMLElement) => {
    const parts: string[] = [];
    const walk = (node: Node) => {
      if (node.nodeType === 3) {
        const text = node.textContent?.trim();
        // An explanation's second-by-second timer is not a new message.
        if (text && !/^\d+\s*″$/.test(text)) parts.push(text);
      } else if (typeof Element !== 'undefined' && node instanceof Element && node.hasAttribute('data-popup-spoken-content')) {
        const text = node.getAttribute('aria-label')?.trim();
        if (text) parts.push(text);
      } else node.childNodes.forEach(walk);
    };
    walk(element);
    return parts.join(' ').replace(/\b\d+\s*″/g, '').replace(/\s+/g, ' ').trim();
  };
  return { text: collect(withoutControls) || collect(copy), language: language as InfoLanguage };
}

