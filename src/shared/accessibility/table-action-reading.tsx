import { useLayoutEffect, useRef } from 'react';
import type { TableAnnouncement } from './table-announcements';
import { canRecoverTableActionFocus } from './table-action-focus';

type Props = {
  enabled: boolean;
  entries: TableAnnouncement[];
  onLiveFallback: (ids: number[]) => void;
};

// Use native paragraph text rather than a named generic container, which
// VoiceOver can describe as an empty group after reading its label.
// A stable, non-interactive reading surface outside the live log. It remains
// focused while the game clears its log and is released by actual navigation.
export default function TableActionReading({ enabled, entries, onLiveFallback }: Props) {
  const actionReading = useRef<HTMLParagraphElement | null>(null);
  const handled = useRef(0);
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    const recoveries = entries.filter(entry => entry.recoverFocus && entry.id > handled.current);
    if (!recoveries.length) return;
    handled.current = recoveries.at(-1)!.id;
    const entry = recoveries[0];
    const node = actionReading.current;
    if (enabled && node && canRecoverTableActionFocus(document)) {
      node.setAttribute('aria-hidden', 'false');
      node.setAttribute('lang', entry.language);
      node.textContent = entry.text;
      node.focus({ preventScroll: true });
      if (document.activeElement === node) {
        const later = recoveries.slice(1);
        if (later.length) onLiveFallback(later.map(item => item.id));
        return;
      }
    }
    // A user or modal may have acquired focus while the batch was pending.
    if (node && document.activeElement !== node) {
      node.setAttribute('aria-hidden', 'true');
      node.textContent = '';
    }
    onLiveFallback(recoveries.map(item => item.id));
  }, [enabled, entries, onLiveFallback]);

  return <p
    ref={actionReading}
    tabIndex={-1}
    aria-hidden
    aria-live="off"
    data-table-action-reading
    onBlur={event => {
      event.currentTarget.setAttribute('aria-hidden', 'true');
      event.currentTarget.textContent = '';
    }}
    style={{
      position: 'absolute', top: 0, left: 0, margin: 0,
      width: '1%', height: '1%', overflow: 'hidden',
      clipPath: 'inset(50%)', pointerEvents: 'none',
    }}
  />;
}
