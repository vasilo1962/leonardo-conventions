import { menuPageArrivalText, completedMenuActionText, type CompletedMenuAction } from './navigation-speech-translations';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'expo-router';
import { getPlayerInfoLanguage, type InfoLanguage } from '@/lib/info-popup-translations';

let currentPage = '';
let pendingOrigin: string | null = null;
let publishArrival: ((text: string, language: InfoLanguage) => void) | null = null;

export function announceCompletedAction(action: CompletedMenuAction, name: string) {
  const language = getPlayerInfoLanguage();
  publishArrival?.(completedMenuActionText(action, name, language), language);
}

export function recordMenuNavigation() {
  pendingOrigin = currentPage;
}

export function cancelMenuNavigation() {
  pendingOrigin = null;
}

export function completeMenuNavigation(page: string) {
  const origin = pendingOrigin;
  currentPage = page;
  if (origin === null || page === origin) return;
  pendingOrigin = null;
  const language = getPlayerInfoLanguage();
  const text = menuPageArrivalText(page, language);
  if (text) publishArrival?.(text, language);
}

export function useMenuPageArrival(page: string, failureMessage: string | null = null) {
  useEffect(() => { if (failureMessage) cancelMenuNavigation(); }, [failureMessage]);
  useEffect(() => { completeMenuNavigation(page); }, [page]);
}

export function MenuNavigationAnnouncer() {
  const path = usePathname();
  const sequence = useRef(0);
  const [arrival, setArrival] = useState<{ id: number; text: string; language: InfoLanguage } | null>(null);
  useEffect(() => {
    const publish = (text: string, language: InfoLanguage) => {
      setArrival({ id: ++sequence.current, text, language });
    };
    publishArrival = publish;
    return () => {
      if (publishArrival === publish) {
        publishArrival = null;
        pendingOrigin = null;
        currentPage = '';
      }
    };
  }, []);
  useEffect(() => {
    if (path !== '/') completeMenuNavigation(path);
  }, [path]);
  if (typeof document === 'undefined') return null;
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '1%', height: '1%', overflow: 'hidden',
        clipPath: 'inset(50%)', pointerEvents: 'none',
      }}
    >
      {arrival ? <span key={arrival.id} lang={arrival.language}>{arrival.text}</span> : null}
    </div>
  );
}
