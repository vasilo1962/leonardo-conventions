import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { buildExercisePreview } from './exercise-page.mjs';
import { accessibleTables } from './table-speech.mjs';
import { pageBase, stylesheet, redirectPage } from './routes.mjs';
import { articles, availableIn } from './articles.mjs';
const require = createRequire(import.meta.url);
const { marked } = await import(require.resolve('marked'));
const languages = JSON.parse(await readFile('content/i18n/languages.json', 'utf8'));
const sectionIds = ['when', 'purpose', 'overcalls', 'examples', 'responses', 'attention'];
// Count Unicode code points, including spaces and punctuation; descriptions are edited, never cut.
for (const language of languages) {
  for (const [index, article] of articles.entries()) {
    if (!availableIn(article, language.code)) continue;
    const description = article.description || language.cards[index];
    if (typeof description !== 'string' || [...description].length > 100) {
      throw new Error(`${language.code}/${article.slug}: catalog description must be at most 100 characters`);
    }
  }
}

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const isolateRtl = html => html.split(/(<[^>]+>)/g).map((part, index) => index % 2 ? part : part.replace(/\b[1-7](?:NT|[♠♥♦♣])|\b\d+[––-]\d+|\b[A-Za-z][A-Za-z0-9]*(?:[ .-]+[A-Za-z][A-Za-z0-9]*)*/g, token => '<bdi dir="ltr">' + token + '</bdi>')).join('');
const canonicalRoot = 'https://leonardobridge.com/';
const sitemapUrls = new Set();
function page({ language, title, description, route, slug, body }) {
  const canonical = canonicalRoot + route;
  sitemapUrls.add(canonical);
  const article = articles.find(item => item.slug === slug);
  const alternates = languages.filter(other => !article || availableIn(article, other.code)).map(other => '<link rel="alternate" hreflang="' + other.code + '" href="' + canonicalRoot + other.code + '/' + (slug ? slug + '/' : 'conventions/') + '">').join('');
  return '<!doctype html>\n<html lang="' + language.code + '"' + (language.dir === 'rtl' ? ' dir="rtl"' : '') + '><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    pageBase(route) +
    '<title>' + escapeHtml(title) + '</title><meta name="description" content="' + escapeHtml(description) + '">' +
    '<link rel="canonical" href="' + canonical + '">' + alternates +
    '<meta property="og:type" content="' + (slug ? 'article' : 'website') + '"><meta property="og:title" content="' + escapeHtml(title) + '"><meta property="og:description" content="' + escapeHtml(description) + '"><meta property="og:url" content="' + canonical + '">' +
    stylesheet('conventions.css') + '</head><body><a class="skip" href="#main">' + escapeHtml(language.ui.skip) + '</a>' +
    body + '<footer>Leonardo Bridge · ' + escapeHtml(language.ui.conventions) + '</footer>' + '</body></html>\n';
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
  }).replace(/<table>/g, '<div class="table-wrap" role="region" aria-label="' + escapeHtml(language.ui.table) + '"><table>').replace(/<\/table>/g, '</table></div>').replace(/<th>/g, '<th scope="col">');
  if (headings.length !== sectionIds.length) throw new Error(`${language.code}/${article.slug}: wrong heading structure`);
  // Paired examples in these lessons; transparent wrappers preserve the mobile flow.
  if (['inverted-minors', 'bergen-raises'].includes(article.slug)) {
    html = html.replace(/(<div class="hand">(?:<div class="hand-row">[\s\S]*?<\/div>){4}<\/div>)\s*(<p>[\s\S]*?<\/p>)/g,
      '<div class="example-row">$1<div class="example-explanation">$2</div></div>');
  }
  if (['jacoby-2nt', 'drury'].includes(article.slug)) {
    html = html.replace(/(<div class="hand">(?:<div class="hand-row">[\s\S]*?<\/div>){4}<\/div>)\s*((?:<p>[\s\S]*?<\/p>\s*)+)/g,
      '<div class="example-row">$1<div class="example-explanation">$2</div></div>');
  }
  if (language.dir === 'rtl') {
    html = isolateRtl(html);
    for (const heading of headings) heading.title = isolateRtl(heading.title);
  }
  html = accessibleTables(html, language.code);
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
    if (!availableIn(article, language.code)) continue;
    const source = await readFile(`content/${language.code}/${article.slug}.md`, 'utf8');
    const { html, headings } = renderArticle(source, article, language);
    const route = `${language.code}/${article.slug}/`;
    const title = article.title + ' | Leonardo Bridge';
    const exercises = language.code !== 'el' || article.exercises === false ? '' : article.exerciseSets
      ? article.exerciseSets.map(set => '<aside class="play-online"><p><strong>Ασκήσεις ' + escapeHtml(set.title) + '</strong></p><p>' + escapeHtml(set.text) + '</p><a class="play-button" href="' + escapeHtml(set.href) + '">Ασκήσεις ' + escapeHtml(set.title) + '</a></aside>').join('')
      : '<aside class="play-online"><p><strong>Ασκήσεις ' + escapeHtml(article.title) + '</strong></p><p>' + escapeHtml(article.exercisesText || 'Δοκίμασε παρεμβολές και απαντήσεις με το δικό σου χέρι και το bidding box.') + '</p><a class="play-button" href="practice/">Δοκίμασε τις ασκήσεις</a></aside>';
    await mkdir('site/' + route, { recursive: true });
    await writeFile('site/' + route + 'index.html', page({ language, title, description: article.description || language.cards[index], route, slug: article.slug,
      body: '<div class="layout"><nav aria-label="' + escapeHtml(language.ui.lesson) + '"><p class="nav-title">' + escapeHtml(language.ui.lesson) + '</p><ol>' + headings.map(({id,title}) => '<li><a href="#' + id + '">' + title + '</a></li>').join('') + '</ol></nav><main id="main"><article><p class="eyebrow">' + escapeHtml(language.ui.learn) + '</p><p class="catalog-return"><a href="../conventions/"><span aria-hidden="true">' + (language.dir === 'rtl' ? '→' : '←') + '</span> ' + escapeHtml(language.ui.allConventions) + '</a></p><h1 dir="ltr">' + escapeHtml(article.title) + '</h1><p class="intro-label">' + escapeHtml(language.ui.intro) + '</p>' + html + '</article>' + exercises + play + '</main></div>'
    }));
    pageCount++;
  }
  for (const route of [language.code + '/conventions/']) {
    const prefix = '../'.repeat(route.split('/').filter(Boolean).length);
    await mkdir('site/' + route, { recursive: true });
    await writeFile('site/' + route + 'index.html', page({ language, route, title: language.ui.conventions + ' | Leonardo Bridge', description: language.ui.description,
      body: '<main id="main" class="listing catalog"><p class="eyebrow">' + escapeHtml(language.ui.learn) + '</p><h1>' + escapeHtml(language.ui.conventions) + '</h1><p>' + escapeHtml(language.ui.catalogIntro) + '</p><section class="convention-list" aria-label="' + escapeHtml(language.ui.conventions) + '">' + articles.map((article, index) => availableIn(article, language.code) ? '<a class="card-link" href="' + prefix + language.code + '/' + article.slug + '/"><strong dir="ltr">' + escapeHtml(article.title) + '</strong><span>' + escapeHtml(article.description || language.cards[index]) + '</span></a>' : '').join('') + '</section>' + play + '</main>'
    }));
    pageCount++;
  }
  await writeFile('site/' + language.code + '/index.html', redirectPage(language.code, language.code + '/conventions/'));
}
await writeFile('site/index.html', redirectPage('el', 'el/conventions/'));
await writeFile('site/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  [...sitemapUrls].sort().map(url => '  <url><loc>' + escapeHtml(url) + '</loc></url>').join('\n') + '\n</urlset>\n');
await buildExercisePreview();
console.log(`${pageCount} lesson/catalog pages, ${languages.length} languages, ${articles.length} conventions, plus Greek exercise pages.`);
