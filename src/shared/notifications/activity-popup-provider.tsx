import { createContext, useCallback, useContext, useLayoutEffect, useId, useRef, useState, type ReactNode } from 'react';

import { useNotificationQueue, type NotificationEntry } from './notification-queue';

type Registration = { group: string; entries: readonly NotificationEntry[]; blocking: boolean };
type PopupContextValue = {
  currentKey?: string;
  register: (group: string, entries: readonly NotificationEntry[] | null, blocking?: boolean) => void;
};
const PopupContext = createContext<PopupContextValue | null>(null);
const popupKey = (group: string, key: string) => JSON.stringify([group, key]);

// The application and activity-local hosts share one queue. Data and presentation
// stay in their original React subtree, including language and accessibility context.
export function ActivityPopupProvider({ scope, children }: { scope: string; children: ReactNode }) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const register = useCallback((group: string, entries: readonly NotificationEntry[] | null, blocking = false) => {
    setRegistrations(previous => {
      const index = previous.findIndex(item => item.group === group);
      if (entries === null) {
        return index < 0 ? previous : previous.filter(item => item.group !== group);
      }
      if (index < 0) return [...previous, { group, entries, blocking }];
      return previous.map(item => item.group === group ? { group, entries, blocking } : item);
    });
  }, []);
  const entries = registrations.flatMap(({ group, entries: requests }) =>
    requests.map(entry => ({ ...entry, key: popupKey(group, entry.key) })));
  const paused = registrations.some(item => item.blocking);
  const current = useNotificationQueue(scope, entries, paused);
  return <PopupContext.Provider value={{ currentKey: current?.key, register }}>
    {children}
  </PopupContext.Provider>;
}

export function useActivityPopups(entries: readonly NotificationEntry[], blocking = false): string | undefined {
  const context = useContext(PopupContext);
  if (!context) throw new Error('Activity pop-ups require ActivityPopupProvider.');
  const { register, currentKey } = context;
  const group = useId();
  const latest = useRef(entries);
  useLayoutEffect(() => { latest.current = entries; }, [entries]);
  // Payload/callback refreshes do not re-register an arrival or cause effect loops.
  const signature = JSON.stringify(entries.map(({ key, kind, revision, validate }) =>
    [key, kind, revision, Boolean(validate)]));
  useLayoutEffect(() => {
    register(group, latest.current.map(entry => ({
      key: entry.key,
      kind: entry.kind,
      revision: entry.revision,
      validate: entry.validate ? () => {
        const request = latest.current.find(item => item.key === entry.key);
        return request?.validate ? request.validate() : Promise.resolve(false);
      } : undefined,
      onInvalid: () => latest.current.find(item => item.key === entry.key)?.onInvalid?.(),
    })), blocking);
  }, [group, register, signature, blocking]);
  useLayoutEffect(() => () => register(group, null), [group, register]);
  // A local close/expiry hides immediately, before its registration effect runs.
  return entries.find(entry => popupKey(group, entry.key) === currentKey)?.kind;
}

// Functional windows retain their own timing/actions. Ordinary notices wait
// without losing arrival order or being consumed while these windows are active.
export function useActivityPopupBlocker(active: boolean) {
  useActivityPopups([], active);
}

// For functional hosts whose existing render condition already defines presence.
// No layout or timer is added; unmount releases this registration.
export function ActivityPopupBlocker() {
  useActivityPopupBlocker(true);
  return null;
}
