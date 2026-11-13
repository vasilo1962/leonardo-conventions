import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export type NotificationEntry = {
  key: string;
  kind: string;
  revision?: number;
  validate?: () => Promise<boolean>;
  onInvalid?: () => void;
};

// Keep arrivals in their observed order; replace payloads from current activity state.
// Missing entries have expired/closed. Repeated keys update rather than enqueue.
export function reconcileNotificationQueue(
  previous: readonly string[],
  entries: readonly NotificationEntry[]
): string[] {
  const valid = new Set(entries.map(entry => entry.key));
  const next = previous.filter(key => valid.has(key));
  const seen = new Set(next);
  for (const entry of entries) {
    if (!seen.has(entry.key)) {
      next.push(entry.key);
      seen.add(entry.key);
    }
  }
  return next;
}

export function useNotificationQueue(
  scope: string,
  entries: readonly NotificationEntry[],
  paused = false
) {
  const [state, setState] = useState<{ scope: string; order: string[] }>({
    scope, order: [],
  });
  const order = reconcileNotificationQueue(
    state.scope === scope ? state.order : [], entries
  );
  if (state.scope !== scope
    || state.order.length !== order.length
    || state.order.some((key, index) => key !== order[index])) {
    setState({ scope, order });
  }
  const candidate = entries.find(entry => entry.key === order[0]);
  const latest = useRef(candidate);
  useLayoutEffect(() => { latest.current = candidate; }, [candidate]);
  const key = candidate?.key;
  const needsValidation = Boolean(candidate?.validate);
  const revision = candidate?.revision;
  // Each committed validation cycle has its own identity, including pause/resume.
  const [validation, setValidation] = useState({ scope, key, revision, paused, needsValidation });
  let token = validation;
  if (validation.scope !== scope || validation.key !== key
    || validation.revision !== revision || validation.paused !== paused
    || validation.needsValidation !== needsValidation) {
    token = { scope, key, revision, paused, needsValidation };
    setValidation(token);
  }
  const committedValidation = useRef(token);
  useLayoutEffect(() => { committedValidation.current = token; }, [token]);
  const [checked, setChecked] = useState<typeof validation | null>(null);
  useEffect(() => {
    if (token.paused || !token.key || !token.needsValidation) return;
    let active = true;
    const entry = latest.current;
    if (!entry?.validate) return;
    void entry.validate().then(valid => {
      if (!active || committedValidation.current !== token) return;
      if (valid) setChecked(token);
      else latest.current?.onInvalid?.();
    }).catch(() => {
      // Do not consume or present an event whose current validity is unknown.
    });
    return () => { active = false; };
  }, [token]);
  return !paused && candidate && (!needsValidation
    || checked === token) ? candidate : null;
}
