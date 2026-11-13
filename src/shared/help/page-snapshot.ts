import type { PageHelpControl, PageHelpSnapshot } from '@/lib/ai-help';

// Read only names and availability, on an explicit Help request. Never read input values.
export function readPageHelpSnapshot(root?: Element | Document | DocumentFragment | null, publicDocument = false): PageHelpSnapshot {
  const snapshot: PageHelpSnapshot = { controls: [], headings: [] };
  if (typeof document === 'undefined') return snapshot;
  const surface = root ?? document.getElementById('ai-help-page-content');
  if (!surface) return snapshot;
  const visible = (element: Element) => {
    if (element.closest('[hidden], [inert], [aria-hidden="true"]')) return false;
    for (let current: Element | null = element; current; current = current.parentElement) {
      const style = window.getComputedStyle(current);
      if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') return false;
    }
    return element.getClientRects().length > 0;
  };
  const clean = (text: string | null) => (text ?? '').replace(/\s+/g, ' ').trim().slice(0, 180);
  const name = (element: Element, field: boolean) => {
    const label = element.getAttribute('aria-label');
    if (label) return clean(label);
    const ids = element.getAttribute('aria-labelledby');
    if (ids) return clean(ids.split(/\s+/).map(id => document.getElementById(id)?.textContent ?? '').join(' '));
    if (field) {
      const labels = (element as HTMLInputElement).labels;
      return clean(labels ? Array.from(labels).map(label => label.textContent ?? '').join(' ') : '');
    }
    return clean(element.textContent);
  };
  const seen = new Set<string>();
  for (const element of surface.querySelectorAll('a, [role="link"], button, [role="button"], input, textarea, select, [role="checkbox"], [role="radio"], [role="switch"]')) {
    if (!visible(element) || element.matches('input[type="hidden"], input[type="password"]')) continue;
    const field = element.matches('input, textarea, select') && !element.matches('input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"]');
    const label = name(element, field);
    if (!label) continue;
    const control: PageHelpControl = { label, kind: field ? 'field' : 'control',
      disabled: Boolean(element.closest(':disabled, [aria-disabled="true"]')),
      selected: Boolean(element.matches(':checked, [aria-selected="true"], [aria-checked="true"], [aria-pressed="true"], [aria-current="page"], [aria-current="true"]')) };
    const key = JSON.stringify(control);
    if (!seen.has(key)) { seen.add(key); snapshot.controls.push(control); }
    if (snapshot.controls.length === 80) break;
  }
  for (const element of surface.querySelectorAll('h1, h2, h3, h4, [role="heading"]')) {
    const label = name(element, false);
    if (visible(element) && label && !snapshot.headings.includes(label)) snapshot.headings.push(label);
    if (snapshot.headings.length === 20) break;
  }
  if (publicDocument) {
    const article = document.getElementById('ai-help-public-document');
    if (article && surface.contains(article)) snapshot.documentText = article.innerText.replace(/\s+/g, ' ').trim().slice(0, 12000);
  }
  return snapshot;
}
