import { readFile } from 'node:fs/promises';
const translations=JSON.parse(await readFile('content/shared/accessibility.json','utf8'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function headerAssets(prefix){return `<link rel="stylesheet" href="${prefix}assets/conventions-accessibility.css"><script type="module" src="${prefix}assets/conventions-accessibility.js"></script>`;}
export function sharedHeader({prefix,language,links}){
 const c=translations[language];
 return `<header class="site-header"><div class="bar"><a class="brand" dir="ltr" href="https://leonardobridge.com/" aria-label="Leonardo Bridge"><img src="${prefix}assets/leonardo-wordmark.svg" width="230" height="30" alt="Leonardo Bridge"></a><div class="header-links">${links}<button class="voice-toggle" type="button" role="switch" aria-checked="false" aria-label="${esc(c.mode)}" hidden><span aria-hidden="true">🔇</span></button><details class="voice-settings" hidden><summary aria-label="${esc(c.settings)}"><span aria-hidden="true">⚙</span></summary><div><label><input type="checkbox" id="voice-reader" aria-label="${esc(c.reader)}"> <span aria-hidden="true">${esc(c.reader)}</span></label></div></details></div></div></header>`;
}
export function accessibilityShell(language){
 const c=translations[language];
 return `<dialog class="voice-intro" aria-label="Leonardo Bridge"><p id="voice-intro-message" tabindex="-1" autofocus>${esc(c.message)}</p><div class="voice-intro-actions"><button type="button" data-voice-close>${esc(c.close)}</button><button type="button" data-voice-disable>${esc(c.disable)}</button></div></dialog><div id="voice-live" class="sr-only" aria-live="polite" aria-atomic="true"></div><div id="voice-caption" aria-hidden="true" inert hidden></div><script type="application/json" id="voice-copy">${JSON.stringify(c).replace(/</g,'\\u003c')}</script>`;
}
