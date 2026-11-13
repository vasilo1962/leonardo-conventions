// Only recover focus that has fallen out of the table's accessible controls.
export function canRecoverTableActionFocus(doc: Document): boolean {
  if (!doc.hasFocus() || doc.visibilityState === 'hidden') return false;
  // An open modal owns the next focus request.
  if (Array.from(doc.querySelectorAll<HTMLElement>('[aria-modal="true"]')).some(
    dialog => !dialog.closest('[aria-hidden="true"], [hidden], [inert]')
      && dialog.getClientRects().length > 0
  )) return false;
  const active = doc.activeElement;
  return !active || active === doc.body || active === doc.documentElement
    || !active.isConnected
    || Boolean(active.closest(
      '[aria-hidden="true"], [hidden], [inert], [aria-disabled="true"], :disabled'
    ));
}

