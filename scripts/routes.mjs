// Public URLs live at /<language>/; previews keep their own complete site tree.
const previewMatch = 'location.pathname.match(/^\\/conventions-preview\\/[a-f0-9]{40}\\//)';
export function pageBase(route) {
  return '<base href="/' + route + '"><script>{const m=' + previewMatch + ';if(m)document.querySelector("base").href=m[0]+' + JSON.stringify(route) + ';}</script>';
}
export function stylesheet(name) {
  return '<link rel="stylesheet" href="/conventions/assets/' + name + '"><script>{const m=' + previewMatch + ';if(m)document.currentScript.previousElementSibling.href=m[0]+"assets/' + name + '";}</script>';
}
export function moduleScript(name) {
  return '<script type="module">{const m=' + previewMatch + ';import((m?m[0]:"/conventions/")+"assets/' + name + '");}</script>';
}
export function redirectPage(language, route) {
  // Client fallback only. A permanent HTTP redirect must be installed by the host.
  return '<!doctype html><html lang="' + language + '"><head><meta charset="utf-8"><title>Leonardo Bridge</title><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><link rel="canonical" href="https://leonardobridge.com/' + route + '"><script>{const m=' + previewMatch + ';location.replace((m?m[0]:"/")+' + JSON.stringify(route) + '+location.search+location.hash);}</script></head><body><a class="skip" href="#main">Leonardo Bridge</a><main id="main"><h1>Leonardo Bridge</h1><a href="/' + route + '">Leonardo Bridge</a></main></body></html>\n';
}
