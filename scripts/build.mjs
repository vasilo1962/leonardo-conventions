import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { marked } = await import(require.resolve('marked'));
const languages = JSON.parse(await readFile('content/i18n/languages.json', 'utf8'));
const articles = [
  { slug: 'multi-landy', title: 'Multi Landy', hands: 8 },
  { slug: 'michaels-cue-bid', title: 'Michaels Cue Bid', hands: 5 },
  { slug: 'unusual-2nt', title: 'Unusual 2NT', hands: 5 },
  { slug: 'dont', title: 'DONT', hands: 7 }
];
const sectionIds = ['when', 'purpose', 'overcalls', 'examples', 'responses', 'attention'];
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const isolateRtl = html => html.split(/(<[^>]+>)/g).map((part, index) => index % 2 ? part : part.replace(/\b[1-7](?:NT|[♠♥♦♣])|\b\d+[––-]\d+|\b[A-Za-z][A-Za-z0-9]*(?:[ .-]+[A-Za-z][A-Za-z0-9]*)*/g, token => '<bdi dir="ltr">' + token + '</bdi>')).join('');
const canonicalRoot = 'https://leonardobridge.com/conventions/';
const sitemapUrls = new Set();
function languageMenu(language, route, slug) {
  const prefix = '../'.repeat(route.split('/').filter(Boolean).length);
  return '<details class="language-menu"><summary dir="auto" lang="' + language.code + '">' + escapeHtml(language.name) + '</summary><ul>' +
    languages.map(other => '<li><a href="' + prefix + other.code + '/' + (slug ? slug + '/' : '') + '" dir="auto" lang="' + other.code + '" hreflang="' + other.code + '"' + (other.code === language.code ? ' aria-current="page"' : '') + '>' + escapeHtml(other.name) + '</a></li>').join('') + '</ul></details>';
}
function page({ language, title, description, route, slug, body }) {
  const prefix = '../'.repeat(route.split('/').filter(Boolean).length);
  const canonical = canonicalRoot + route;
  sitemapUrls.add(canonical);
  const alternates = languages.map(other => '<link rel="alternate" hreflang="' + other.code + '" href="' + canonicalRoot + other.code + '/' + (slug ? slug + '/' : '') + '">').join('');
  return '<!doctype html>\n<html lang="' + language.code + '"' + (language.dir === 'rtl' ? ' dir="rtl"' : '') + '><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<base href="/conventions/' + route + '">' +
    '<script>const m=location.pathname.match(/^\\/conventions-preview\\/[a-f0-9]{40}\\//);if(m){const b=document.querySelector("base");b.href=m[0]+b.getAttribute("href").slice("/conventions/".length);}</script>' +
    '<title>' + escapeHtml(title) + '</title><meta name="description" content="' + escapeHtml(description) + '">' +
    '<link rel="canonical" href="' + canonical + '">' + alternates +
    '<meta property="og:type" content="' + (slug ? 'article' : 'website') + '"><meta property="og:title" content="' + escapeHtml(title) + '"><meta property="og:description" content="' + escapeHtml(description) + '"><meta property="og:url" content="' + canonical + '">' +
    '<link rel="stylesheet" href="' + prefix + 'assets/conventions.css"></head><body><a class="skip" href="#main">' + escapeHtml(language.ui.skip) + '</a>' +
    '<header><div class="bar"><a class="brand" dir="ltr" href="https://leonardobridge.com/">Leonardo Bridge</a><div class="header-links"><a href="' + (route ? prefix + language.code + '/' : './') + '">' + escapeHtml(language.ui.conventions) + '</a>' + languageMenu(language, route, slug) + '</div></div></header>' +
    body + '<footer>Leonardo Bridge · ' + escapeHtml(language.ui.conventions) + '</footer></body></html>\n';
}
function renderArticle(source, article, language) {
  let handCount = 0;
  const content = source.replace(/^# [^\n]+\n/, '').replace(/♠ ([AKQJT2-9]+)  \n♥ ([AKQJT2-9]+)  \n♦ ([AKQJT2-9]+)  \n♣ ([AKQJT2-9]+)/g, (_, ...args) => {
    const cards = args.slice(0, 4);
    if (cards.join('').length !== 13) throw new Error(`${language.code}/${article.slug}: hand must have 13 cards`);
    for (const suit of cards) if (new Set(suit).size !== suit.length) throw new Error('Duplicate card in hand');
    handCount++;
    return '<div class="hand">' + cards.map((s, i) => `<div class="hand-row"><span aria-hidden="true" dir="ltr"><span class="${i === 1 || i === 2 ? 'red' : ''}">${'♠♥♦♣'[i]}</span> ${s}</span><span class="sr-only">${escapeHtml(language.suits[i])}: ${[...s].map(r => escapeHtml(language.ranks[r] || r)).join(', ')}.</span></div>`).join('') + '</div>\n';
  });
  if (handCount !== article.hands) throw new Error(`${language.code}/${article.slug}: wrong number of hands`);
  const headings = [];
  let html = marked.parse(content).replace(/<h2>(.*?)<\/h2>/g, (_, title) => {
    const id = sectionIds[headings.length];
    headings.push({ id, title });
    return `<h2 id="${id}">${title}</h2>`;
  }).replace(/<table>/g, '<div class="table-wrap" role="region" aria-label="' + escapeHtml(language.ui.table) + '" tabindex="0"><table>').replace(/<\/table>/g, '</table></div>').replace(/<th>/g, '<th scope="col">');
  if (headings.length !== sectionIds.length) throw new Error(`${language.code}/${article.slug}: wrong heading structure`);
  if (language.dir === 'rtl') {
    html = isolateRtl(html);
    for (const heading of headings) heading.title = isolateRtl(heading.title);
  }
  return { html, headings };
}
async function playOnline(language) {
  if (language.code === 'el') return await readFile('content/shared/play-online.el.html', 'utf8') + '\n';
  return '<aside class="play-online"><p>' + (language.dir === 'rtl' ? isolateRtl(escapeHtml(language.ui.playText)) : escapeHtml(language.ui.playText)) + '</p><a class="play-button" href="https://leonardobridge.com/">' + escapeHtml(language.ui.play) + '</a></aside>';
}
let pageCount = 0;
for (const language of languages) {
  const play = await playOnline(language);
  for (const [index, article] of articles.entries()) {
    const source = await readFile(`content/${language.code}/${article.slug}.md`, 'utf8');
    const { html, headings } = renderArticle(source, article, language);
    const route = `${language.code}/${article.slug}/`;
    const title = article.title + ' | Leonardo Bridge';
    await mkdir('site/' + route, { recursive: true });
    await writeFile('site/' + route + 'index.html', page({ language, title, description: language.cards[index], route, slug: article.slug,
      body: '<div class="layout"><nav aria-label="' + escapeHtml(language.ui.lesson) + '"><p class="nav-title">' + escapeHtml(language.ui.lesson) + '</p><ol>' + headings.map(({id,title}) => '<li><a href="#' + id + '">' + title + '</a></li>').join('') + '</ol></nav><main id="main"><article><p class="eyebrow">' + escapeHtml(language.ui.learn) + '</p><h1 dir="ltr">' + escapeHtml(article.title) + '</h1><p class="intro-label">' + escapeHtml(language.ui.intro) + '</p>' + html + '</article>' + play + '</main></div>'
    }));
    pageCount++;
  }
  for (const route of [language.code + '/', ...(language.code === 'el' ? [''] : [])]) {
    const prefix = '../'.repeat(route.split('/').filter(Boolean).length);
    await mkdir('site/' + route, { recursive: true });
    await writeFile('site/' + route + 'index.html', page({ language, route, title: language.ui.conventions + ' | Leonardo Bridge', description: language.ui.description,
      body: '<main id="main" class="listing catalog"><p class="eyebrow">' + escapeHtml(language.ui.learn) + '</p><h1>' + escapeHtml(language.ui.conventions) + '</h1><p>' + escapeHtml(language.ui.description) + '</p><section aria-label="' + escapeHtml(language.ui.conventions) + '">' + articles.map((article, index) => '<a class="card-link" href="' + prefix + language.code + '/' + article.slug + '/"><strong dir="ltr">' + escapeHtml(article.title) + '</strong><span>' + escapeHtml(language.cards[index]) + '</span></a>').join('') + '</section>' + play + '</main>'
    }));
    pageCount++;
  }
}
await writeFile('site/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  [...sitemapUrls].sort().map(url => '  <url><loc>' + escapeHtml(url) + '</loc></url>').join('\n') + '\n</urlset>\n');
console.log(`${pageCount} static pages, ${languages.length} languages, ${articles.length} conventions.`);
