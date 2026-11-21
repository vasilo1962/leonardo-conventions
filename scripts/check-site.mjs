import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import assert from 'node:assert/strict';
const languages = JSON.parse(await readFile('content/i18n/languages.json', 'utf8'));
import { articles as lessons, availableIn } from './articles.mjs';
const articles = lessons.map(article => article.slug);
const ready = (slug, code) => availableIn(lessons.find(article => article.slug === slug), code);
const siteRoot = resolve('site');
const handPattern = /♠ ([AKQJT2-9]+|—)  \n♥ ([AKQJT2-9]+|—)  \n♦ ([AKQJT2-9]+|—)  \n♣ ([AKQJT2-9]+|—)/g;
const hands = text => [...text.matchAll(handPattern)].map(match => match.slice(1));
let checked = 0;
for (const language of languages) {
  for (const slug of articles.filter(slug => ready(slug, language.code))) {
    const reference = await readFile(`content/el/${slug}.md`, 'utf8');
    const translated = await readFile(`content/${language.code}/${slug}.md`, 'utf8');
    assert.deepEqual(hands(translated), hands(reference), `${language.code}/${slug}: changed example hand`);
    assert.equal((translated.match(/^## /gm) || []).length, 6);
    assert.ok(!translated.includes('{{H'));
    if (language.code !== 'el') assert.ok(!/[\u0370-\u03ff]/.test(translated), `${language.code}/${slug}: untranslated Greek`);
    const html = await readFile(`site/${language.code}/${slug}/index.html`, 'utf8');
    assert.ok(html.includes(`<html lang="${language.code}"${language.dir === 'rtl' ? ' dir="rtl"' : ''}>`));
    assert.ok(html.includes(`rel="canonical" href="https://leonardobridge.com/${language.code}/${slug}/"`));
    if (language.dir === 'rtl') {
      assert.ok(html.includes('<bdi dir="ltr">'));
      assert.equal((html.match(/aria-hidden="true" dir="ltr"/g)||[]).length, 4 * hands(reference).length);
    }
    assert.equal((html.match(/class="hand"/g)||[]).length, hands(reference).length);
    assert.equal((html.match(/<span class="sr-only"/g)||[]).length, 4 * hands(reference).length);
    const localBase = new URL(`https://leonardobridge.com/${language.code}/${slug}/`);
    for (const [,href] of html.matchAll(/href="([^"]+)"/g)) {
      if (href.startsWith('#')) {
        assert.ok(html.includes(`id="${href.slice(1)}"`), `${language.code}/${slug}: missing anchor ${href}`);
        continue;
      }
      if (/^https?:/.test(href)) continue;
      const target = new URL(href, localBase);
      const path = target.pathname.startsWith('/conventions/assets/') ? target.pathname.slice('/conventions/'.length) : target.pathname.slice(1);
      let file = resolve(siteRoot, path);
      if (target.pathname.endsWith('/')) file = resolve(file,'index.html');
      assert.ok(file.startsWith(siteRoot + '/'));
      await access(file);
    }
    for (const other of languages.filter(other => ready(slug, other.code))) {
      assert.ok(html.includes(`hreflang="${other.code}" href="https://leonardobridge.com/${other.code}/${slug}/"`));
    }
    if (slug === 'michaels-cue-bid') assert.ok(html.includes('href="../unusual-2nt/"'));
    if (slug === 'unusual-2nt') assert.ok(html.includes('href="../michaels-cue-bid/"'));
    checked++;
  }
  const catalog = await readFile(`site/${language.code}/conventions/index.html`, 'utf8');
  assert.ok(catalog.includes(`<html lang="${language.code}"${language.dir === 'rtl' ? ' dir="rtl"' : ''}>`));
  for (const slug of articles.filter(slug => ready(slug, language.code))) assert.ok(catalog.includes(`href="../../${language.code}/${slug}/"`));
}
assert.ok((await readFile('site/index.html','utf8')).includes('location.replace'));
for (const language of languages) {
  const redirect = await readFile(`site/${language.code}/index.html`, 'utf8');
  assert.ok(redirect.includes('location.replace'));
  assert.ok(redirect.includes(`https://leonardobridge.com/${language.code}/conventions/`));
}
console.log(`Verified ${checked} articles, ${languages.length} languages: identical hands, localized accessibility, metadata, language links and internal navigation.`);

// The sitemap must cover exactly the generated canonical pages, including every language.
const sitemap = await readFile('site/sitemap.xml', 'utf8');
assert.ok(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
assert.ok(sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const expectedUrls = [];
for (const language of languages) {
  expectedUrls.push('https://leonardobridge.com/' + language.code + '/conventions/');
  for (const slug of articles.filter(slug => ready(slug, language.code))) expectedUrls.push('https://leonardobridge.com/' + language.code + '/' + slug + '/');
}
assert.deepEqual([...sitemapUrls].sort(), expectedUrls.sort(), 'Sitemap missing, duplicate or unexpected URL');
assert.ok(!sitemap.includes('conventions-preview'));
assert.ok(!sitemap.includes('<lastmod>'), 'Do not invent modification dates on rebuild');
console.log('Verified sitemap: ' + sitemapUrls.length + ' canonical URLs, no preview URLs or duplicates.');
