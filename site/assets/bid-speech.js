// The same localized bid names serve static lessons and dynamic exercise text.
// Suit symbols remain visible; only their spoken representation is replaced.
const tokens = /(?<!\p{N})([1-7])\s*([♣♦♥♠])\uFE0F?|(?<![A-Za-z0-9])([1-7])\s*(NT|ΝΤ|SA|ST|UT|BA|BT|БК)(?![A-Za-zΑ-Ωα-ω0-9])|[♣♦♥♠]\uFE0F?/gu;
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function bidSpeechParts(text, copy) {
  const parts = [];
  let end = 0;
  for (const match of text.matchAll(tokens)) {
    if (match.index > end) parts.push({ text: text.slice(end, match.index) });
    const level = match[1] || match[3];
    const suit = match[2] || (level ? 'NT' : match[0][0]);
    const speech = level ? copy.bids[level][suit] : copy.suits['♣♦♥♠'.indexOf(suit)];
    parts.push({ text: match[0], speech });
    end = match.index + match[0].length;
  }
  if (end < text.length) parts.push({ text: text.slice(end) });
  return parts;
}
export function spokenBidText(text, copy) {
  return bidSpeechParts(text, copy).map(part => part.speech || part.text).join('');
}
// Input is an already-escaped HTML text node, never an attribute or raw user text.
export function accessibleBidText(text, copy) {
  return bidSpeechParts(text, copy).map(part => part.speech
    ? '<span class="spoken-bid"><span aria-hidden="true">' + part.text + '</span><span class="sr-only">' + escape(part.speech) + '</span></span>'
    : part.text).join('');
}
export function accessibleInlineBids(html, copy) {
  const stack = [];
  const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
  const protectedTags = new Set(['head','title','table','script','style','textarea','code','pre','noscript']);
  return html.split(/(<[^>]*>)/g).map(part => {
    if (!part.startsWith('<')) return stack.some(entry => entry.protected) ? part : accessibleBidText(part, copy);
    const close = part.match(/^<\/([a-z][\w-]*)/i);
    if (close) {
      const index = stack.map(entry => entry.tag).lastIndexOf(close[1].toLowerCase());
      if (index >= 0) stack.splice(index);
      return part;
    }
    const open = part.match(/^<([a-z][\w-]*)\b/i);
    if (open && !voidTags.has(open[1].toLowerCase()) && !/\/\s*>$/.test(part)) {
      const classes = part.match(/\bclass="([^"]*)"/)?.[1].split(/\s+/) || [];
      stack.push({ tag: open[1].toLowerCase(), protected: protectedTags.has(open[1].toLowerCase()) || /\baria-hidden=["']true["']/.test(part) || classes.some(value => ['sr-only','hand','spoken-bid'].includes(value)) });
    }
    return part;
  }).join('');
}
// DOM construction keeps exercise content as text and preserves surrounding links.
export function setSpokenBidText(element, text, copy) {
  const document = element.ownerDocument;
  element.replaceChildren(...bidSpeechParts(text, copy).map(part => {
    if (!part.speech) return document.createTextNode(part.text);
    const outer = document.createElement('span'); outer.className = 'spoken-bid';
    const visual = document.createElement('span'); visual.setAttribute('aria-hidden','true'); visual.textContent = part.text;
    const spoken = document.createElement('span'); spoken.className = 'sr-only'; spoken.textContent = part.speech;
    outer.append(visual, spoken);
    return outer;
  }));
}
