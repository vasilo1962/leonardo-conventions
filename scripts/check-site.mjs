import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import assert from 'node:assert/strict';
const languages = JSON.parse(await readFile('content/i18n/languages.json', 'utf8'));
const articles = ['multi-landy','michaels-cue-bid','unusual-2nt','dont'];
const siteRoot = resolve('site');
const handPattern = /♠ ([AKQJT2-9]+)  \n♥ ([AKQJT2-9]+)  \n♦ ([AKQJT2-9]+)  \n♣ ([AKQJT2-9]+)/g;
const hands = text => [...text.matchAll(handPattern)].map(match => match.slice(1));
let checked = 0;
for (const language of languages) {
  for (const slug of articles) {
    const reference = await readFile(`content/el/${slug}.md`, 'utf8');
    const translated = await readFile(`content/${language.code}/${slug}.md`, 'utf8');
    assert.deepEqual(hands(translated), hands(reference), `${language.code}/${slug}: changed example hand`);
    assert.equal((translated.match(/^## /gm) || []).length, 6);
    assert.ok(!translated.includes('{{H'));
    if (language.code !== 'el') assert.ok(!/[\u0370-\u03ff]/.test(translated), `${language.code}/${slug}: untranslated Greek`);
    const html = await readFile(`site/${language.code}/${slug}/index.html`, 'utf8');
    assert.ok(html.includes(`<html lang="${language.code}">`));
    assert.ok(html.includes(`rel="canonical" href="https://leonardobridge.com/conventions/${language.code}/${slug}/"`));
    assert.ok(html.includes('class="brand" href="https://leonardobridge.com/"'));
    assert.equal((html.match(/class="hand"/g)||[]).length, hands(reference).length);
    assert.equal((html.match(/class="sr-only"/g)||[]).length, 4 * hands(reference).length);
    const localBase = new URL(`https://leonardobridge.com/conventions/${language.code}/${slug}/`);
    for (const [,href] of html.matchAll(/href="([^"]+)"/g)) {
      if (href.startsWith('#')) {
        assert.ok(html.includes(`id="${href.slice(1)}"`), `${language.code}/${slug}: missing anchor ${href}`);
        continue;
      }
      if (/^https?:/.test(href)) continue;
      const target = new URL(href, localBase);
      assert.ok(target.pathname.startsWith('/conventions/'));
      let file = resolve(siteRoot, target.pathname.slice('/conventions/'.length));
      if (target.pathname.endsWith('/')) file = resolve(file,'index.html');
      assert.ok(file.startsWith(siteRoot + '/'));
      await access(file);
    }
    for (const other of languages) {
      assert.ok(html.includes(`hreflang="${other.code}" href="https://leonardobridge.com/conventions/${other.code}/${slug}/"`));
      assert.ok(html.includes(`href="../../${other.code}/${slug}/"`));
    }
    if (slug === 'michaels-cue-bid') assert.ok(html.includes('href="../unusual-2nt/"'));
    if (slug === 'unusual-2nt') assert.ok(html.includes('href="../michaels-cue-bid/"'));
    checked++;
  }
  const catalog = await readFile(`site/${language.code}/index.html`, 'utf8');
  assert.ok(catalog.includes(`<html lang="${language.code}">`));
  for (const slug of articles) assert.ok(catalog.includes(`href="../${language.code}/${slug}/"`));
}
assert.ok((await readFile('site/index.html','utf8')).includes('href="el/dont/"'));
console.log(`Verified ${checked} articles, ${languages.length} languages: identical hands, localized accessibility, metadata, language links and internal navigation.`);
