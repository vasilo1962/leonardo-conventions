const LIVE_SELECTOR = '[aria-live="polite"], [aria-live="assertive"], [role="alert"], [role="status"], [role="log"]';
const IGNORED_SELECTOR = '[aria-hidden="true"], [hidden], [inert], [data-voice-caption]';

function ignored(element: Element) {
  return Boolean(element.closest(IGNORED_SELECTOR));
}

function visibleText(node: Node): string {
  if (node.nodeType === 3) {
    const parent = node.parentElement;
    return parent && !ignored(parent) ? node.textContent ?? '' : '';
  }
  if (!(node instanceof Element) || ignored(node) || node.matches('input, textarea, select')) return '';
  return Array.from(node.childNodes).map(visibleText).filter(Boolean).join(' ');
}

function clean(text: string) {
  return text.replace(/\u200b/g, '').replace(/\s+/g, ' ').trim();
}

export function focusedVoiceText(element: Element): string {
  if (ignored(element)) return '';
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const text = labelledBy.split(/\s+/).map(id => element.ownerDocument.getElementById(id)?.textContent ?? '').join(' ');
    if (clean(text)) return clean(text);
  }
  const label = element.getAttribute('aria-label');
  if (label !== null) return clean(label);
  return clean(visibleText(element));
}

// Observe existing reading surfaces. This adapter never focuses or announces.
export function observeVoiceCaption(doc: Document, onText: (text: string) => void) {
  let focusTarget: Element | null = null;
  let focusText = '';
  const onFocus = (event: FocusEvent) => {
    if (event.target instanceof Element) {
      const text = focusedVoiceText(event.target);
      focusTarget = event.target;
      focusText = text;
      if (text) onText(text);
    }
  };
  doc.addEventListener('focusin', onFocus, true);
  const observer = new MutationObserver(records => {
    const parts: string[] = [];
    const regionsRead = new Set<Element>();
    const append = (node: Node) => {
      const text = clean(visibleText(node));
      if (text) parts.push(text);
    };
    for (const record of records) {
      const target = record.target instanceof Element ? record.target : record.target.parentElement;
      if (!target || ignored(target)) continue;
      if (record.type === 'attributes') {
        if (target === doc.activeElement) {
          const text = focusedVoiceText(target);
          // Attribute mutations made before focus are delivered afterwards.
          // The focus event has already mirrored this exact reading.
          if (text && (target !== focusTarget || text !== focusText)) {
            parts.push(text);
            focusTarget = target;
            focusText = text;
          }
        }
        continue;
      }
      const region = target.closest(LIVE_SELECTOR);
      if (region && region.getAttribute('aria-live') !== 'off' && !ignored(region)) {
        const atomic = region.getAttribute('aria-atomic') === 'true'
          || (!region.hasAttribute('aria-atomic') && region.matches('[role="alert"], [role="status"]'));
        if (atomic) {
          if (!regionsRead.has(region)) { append(region); regionsRead.add(region); }
        } else if (record.type === 'characterData') {
          append(record.target);
        } else {
          record.addedNodes.forEach(append);
        }
        continue;
      }
      if (record.type === 'childList') {
        record.addedNodes.forEach(node => {
          if (!(node instanceof Element) || ignored(node)) return;
          const regions = [
            ...(node.matches(LIVE_SELECTOR) ? [node] : []),
            ...Array.from(node.querySelectorAll(LIVE_SELECTOR)),
          ];
          for (const next of regions) {
            if (next.getAttribute('aria-live') === 'off' || ignored(next)
                || regionsRead.has(next) || regions.some(other => other !== next && other.contains(next))) continue;
            append(next); regionsRead.add(next);
          }
        });
      }
    }
    const text = parts.join(' ').trim();
    if (text) onText(text);
  });
  observer.observe(doc.body, {
    subtree: true, childList: true, characterData: true,
    attributes: true, attributeFilter: ['aria-label', 'aria-labelledby'],
  });
  return () => {
    doc.removeEventListener('focusin', onFocus, true);
    observer.disconnect();
  };
}

