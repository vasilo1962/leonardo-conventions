// Menus skip disabled/selected controls. Setup forms can explicitly expose disabled values for reading.
export function canFocusHoveredControl(element: HTMLElement, allowDisabled = false): boolean {
  if (element.closest('[aria-hidden="true"], [hidden], [inert], [aria-selected="true"]')) return false;
  const disabledScope = allowDisabled ? element.parentElement : element;
  return !disabledScope?.closest('[aria-disabled="true"], :disabled');
}
