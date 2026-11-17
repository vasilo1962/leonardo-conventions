import { readFile, access, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import { articles, availableIn } from './articles.mjs';
const languages = JSON.parse(await readFile('content/i18n/languages.json', 'utf8'));
const preview = '/conventions-preview/' + 'a'.repeat(40) + '/';
const root = resolve('site');
let checked = 0;
async function check(file, route, prefix) {
  const html = await readFile(file, 'utf8');
  const base = { href: html.match(/<base href="([^"]+)"/)[1] };
  const styles = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(m => ({ href: m[1] }));
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  let index = 0;
  for (const [, code] of scripts) {
    runInNewContext(code, { location: { pathname: prefix + route.replace(/\/$/, '') }, document: { querySelector: () => base, currentScript: { previousElementSibling: styles[index] } } });
    if (code.includes('previousElementSibling')) index++;
  }
  assert.equal(base.href, prefix + route);
  for (const style of styles) {
    assert.equal(style.href, (prefix === '/' ? '/conventions/' : prefix) + 'assets/' + style.href.split('/').pop());
    await access(resolve(root, 'assets', style.href.split('/').pop()));
  }
  for (const [, href] of html.matchAll(/<a[^>]*href="([^"]+)"/g)) {
    const url = new URL(href, 'https://leonardobridge.com' + base.href);
    if (url.origin !== 'https://leonardobridge.com' || href.startsWith('https:')) continue;
    if (href.startsWith('#')) { assert.ok(html.includes('id="' + url.hash.slice(1) + '"')); continue; }
    assert.ok(url.pathname.startsWith(prefix));
    await access(resolve(root, url.pathname.slice(prefix.length), 'index.html'));
  }
  checked++;
}
for (const prefix of ['/', preview]) {
  for (const language of languages) {
    await check(`site/${language.code}/conventions/index.html`, `${language.code}/conventions/`, prefix);
    for (const {slug, exercises} of articles.filter(article => availableIn(article, language.code))) {
      await check(`site/${language.code}/${slug}/index.html`, `${language.code}/${slug}/`, prefix);
      if (language.code === 'el' && exercises !== false) await check(`site/el/${slug}/practice/index.html`, `el/${slug}/practice/`, prefix);
    }
    const redirect = await readFile(`site/${language.code}/index.html`, 'utf8');
    let destination;
    runInNewContext(redirect.match(/<script>(.*?)<\/script>/)[1], { location: { pathname: (prefix === '/' ? '/conventions/' : prefix) + language.code, search: '?source=legacy', hash: '#main', replace: value => { destination = value; } } });
    assert.equal(destination, prefix + language.code + '/conventions/?source=legacy#main');
  }
}
console.log(`Verified ${checked} public/preview page routes, same-version resources, navigation without trailing slash and all legacy catalog redirects with query and fragment preservation.`);
