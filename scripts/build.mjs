import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { marked } = await import(require.resolve('marked'));

const article = await readFile('content/el/multi-landy.md', 'utf8');
const playOnline = await readFile('content/shared/play-online.el.html', 'utf8');
const suits = ['πίκες', 'κούπες', 'καρά', 'σπαθιά'];
const ranks = { A: 'άσος', K: 'ρήγας', Q: 'ντάμα', J: 'βαλές', T: 'δέκα' };
let handCount = 0;
const content = article.replace(/^# Multi Landy\n/, '').replace(/♠ ([AKQJT2-9]+)  \n♥ ([AKQJT2-9]+)  \n♦ ([AKQJT2-9]+)  \n♣ ([AKQJT2-9]+)/g, (_, ...args) => {
  const cards = args.slice(0, 4);
  if (cards.join('').length !== 13) throw new Error('Χέρι χωρίς 13 φύλλα');
  for (const suit of cards) if (new Set(suit).size !== suit.length) throw new Error('Διπλό φύλλο');
  handCount++;
  return '<div class="hand">' + cards.map((s, i) => `<div class="hand-row"><span aria-hidden="true"><span class="${i === 1 || i === 2 ? 'red' : ''}">${'♠♥♦♣'[i]}</span> ${s}</span><span class="sr-only">${suits[i]}: ${[...s].map(r => ranks[r] || r).join(', ')}.</span></div>`).join('') + '</div>\n';
});
if (handCount !== 8) throw new Error('Μη αναμενόμενος αριθμός παραδειγμάτων');
const ids = ['when', 'purpose', 'overcalls', 'examples', 'responses', 'attention'];
const headings = [];
let html = marked.parse(content).replace(/<h2>(.*?)<\/h2>/g, (_, title) => {
  const id = ids[headings.length];
  headings.push({ id, title });
  return `<h2 id="${id}">${title}</h2>`;
}).replace(/<table>/g, '<div class="table-wrap" role="region" aria-label="Πίνακας αγορών" tabindex="0"><table>').replace(/<\/table>/g, '</table></div>').replace(/<th>/g, '<th scope="col">');
if (headings.length !== ids.length) throw new Error('Μη αναμενόμενη δομή άρθρου');
const legacy = JSON.parse(await readFile('content/legacy/conventions.el.json', 'utf8'));
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function page({ title, description, route = '', canonicalRoute = route, body }) {
  const prefix = '../'.repeat(route.split('/').filter(Boolean).length);
  const canonical = 'https://leonardobridge.com/conventions/' + canonicalRoute;
  return '<!doctype html>\n<html lang="el"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<base href="/conventions/' + route + '">' +
    '<script>const m=location.pathname.match(/^\\/conventions-preview\\/[a-f0-9]{40}\\//);if(m){const b=document.querySelector("base");b.href=m[0]+b.getAttribute("href").slice("/conventions/".length);}</script>' +
    '<title>' + escapeHtml(title) + '</title><meta name="description" content="' + escapeHtml(description) + '">' +
    '<link rel="canonical" href="' + canonical + '"><link rel="alternate" hreflang="el" href="' + canonical + '">' +
    '<meta property="og:type" content="' + (route && route !== 'el/' ? 'article' : 'website') + '"><meta property="og:title" content="' + escapeHtml(title) + '"><meta property="og:description" content="' + escapeHtml(description) + '"><meta property="og:url" content="' + canonical + '"><meta property="og:locale" content="el_GR">' +
    '<link rel="stylesheet" href="' + prefix + 'assets/conventions.css"></head><body><a class="skip" href="#main">Στο περιεχόμενο</a>' +
    '<header><div class="bar"><a class="brand" href="https://leonardobridge.com/">Leonardo Bridge</a><div class="header-links"><a href="' + (prefix || './') + '">Συμβάσεις</a><span>Ελληνικά</span></div></div></header>' +
    body + '<footer>Leonardo Bridge · Συμβάσεις μπριτζ</footer></body></html>\n';
}
const description = 'Multi Landy μετά από άνοιγμα 1ΝΤ: οι παρεμβολές, οι απαντήσεις και παραδείγματα χεριών, βήμα βήμα.';
await mkdir('site/el/multi-landy', { recursive: true });
await writeFile('site/el/multi-landy/index.html', page({
  title: 'Multi Landy: παρεμβολές στο 1ΝΤ και απαντήσεις | Leonardo Bridge', description, route: 'el/multi-landy/',
  body: '<div class="layout"><nav aria-label="Περιεχόμενα άρθρου"><p class="nav-title">ΣΕ ΑΥΤΟ ΤΟ ΜΑΘΗΜΑ</p><ol>' +
    headings.map(({ id, title }) => '<li><a href="#' + id + '">' + title + '</a></li>').join('') +
    '</ol></nav><main id="main"><article><p class="eyebrow">ΠΑΡΕΜΒΟΛΕΣ ΜΕΤΑ ΑΠΟ 1ΝΤ</p><h1>Multi Landy</h1><p class="intro-label">Εφαρμογή, παραδείγματα και απαντήσεις</p>' +
    html + '</article>' + playOnline + '</main></div>'
}));
const groups = [...new Set(legacy.articles.map(a => a.group))];
for (const [path, prefix, route] of [['site/index.html', '', ''], ['site/el/index.html', '../', 'el/']]) {
  const cards = groups.map((group, index) => '<section aria-labelledby="group-' + index + '"><h3 id="group-' + index + '">' + escapeHtml(group) + '</h3><ul class="convention-list">' +
    legacy.articles.filter(a => a.group === group).map(a => '<li><a href="' + prefix + a.slug + '/">' + escapeHtml(a.title) + '</a></li>').join('') +
    '</ul></section>').join('');
  await writeFile(path, page({
    title: 'Συμβάσεις μπριτζ | Leonardo Bridge',
    description: 'Συμβάσεις μπριτζ, αναλυτικοί οδηγοί με παραδείγματα και σημειώσεις συστήματος.',
    route,
    body: '<main id="main" class="listing catalog"><p class="eyebrow">ΜΑΘΑΙΝΟΥΜΕ ΜΠΡΙΤΖ</p><h1>Συμβάσεις μπριτζ</h1>' +
      '<p>Εξηγήσεις, παραδείγματα χεριών και συνέχειες αγορών.</p>' +
      '<section aria-labelledby="detailed-guides"><h2 id="detailed-guides">Αναλυτικοί οδηγοί</h2>' +
      '<a class="card-link" href="' + prefix + 'el/multi-landy/"><strong>Multi Landy</strong><span>Παρεμβολές μετά από φυσικό άνοιγμα 1ΝΤ του αντιπάλου.</span></a></section>' +
      '<section aria-labelledby="system-notes"><h2 id="system-notes">Σημειώσεις συστήματος</h2><p class="catalog-note">Σύντομες σημειώσεις που περιγράφουν συμφωνίες συγκεκριμένου ζευγαριού. Οι εκδοχές μπορεί να διαφέρουν από τους αναλυτικούς οδηγούς.</p>' +
      cards + '</section>' + playOnline + '</main>'
  }));
}
for (const a of legacy.articles) {
  const content = a.sections.map(section => (section.heading ? '<h2>' + escapeHtml(section.heading) + '</h2>' : '') +
    section.lines.map(line => '<p>' + escapeHtml(line) + '</p>').join('')).join('');
  const variantNote = a.slug === 'asmeniadis-two-suit-overcalls'
    ? '<p class="variant-note">Η ενότητα Multi Landy παρακάτω περιγράφει διαφορετικές συμφωνίες από τον <a href="../el/multi-landy/">αναλυτικό οδηγό Multi Landy</a>.</p>' : '';
  for (const slug of [a.slug, ...Object.keys(legacy.aliases).filter(alias => legacy.aliases[alias] === a.slug)]) {
    await mkdir('site/' + slug, { recursive: true });
    await writeFile('site/' + slug + '/index.html', page({
      title: a.title + ' | Συμβάσεις μπριτζ | Leonardo Bridge',
      description: (a.title + ': ' + (a.sections[0]?.lines[0] || 'Σημειώσεις συστήματος')).slice(0, 155),
      route: slug + '/', canonicalRoute: a.slug + '/',
      body: '<div class="legacy-layout"><main id="main"><article><p class="eyebrow">ΣΗΜΕΙΩΣΕΙΣ ΣΥΣΤΗΜΑΤΟΣ</p><h1>' + escapeHtml(a.title) +
        '</h1><p class="intro-label">Συμφωνίες συγκεκριμένου ζευγαριού · ' + escapeHtml(a.group) + '</p>' + variantNote +
        content + '</article>' + playOnline + '</main></div>'
    }));
  }
}
console.log('Έτοιμες ' + (3 + legacy.articles.length + Object.keys(legacy.aliases).length) + ' στατικές σελίδες · 8 χέρια · 23 παλιά κείμενα και 16 παλιές εναλλακτικές διευθύνσεις.');
