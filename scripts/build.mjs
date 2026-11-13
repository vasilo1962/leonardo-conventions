import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { marked } = await import(require.resolve('marked'));

const articles = [
  { slug: 'multi-landy', title: 'Multi Landy', hands: 8, eyebrow: 'ΠΑΡΕΜΒΟΛΕΣ ΜΕΤΑ ΑΠΟ 1ΝΤ', description: 'Multi Landy μετά από άνοιγμα 1ΝΤ: οι παρεμβολές, οι απαντήσεις και παραδείγματα χεριών, βήμα βήμα.' },
  { slug: 'michaels-cue-bid', title: 'Michaels Cue Bid', hands: 5, eyebrow: 'ΔΙΧΡΩΜΕΣ ΠΑΡΕΜΒΟΛΕΣ', description: 'Michaels Cue Bid: δίχρωμες παρεμβολές με τουλάχιστον 5-5, απαντήσεις και παραδείγματα χεριών.' }
];
const playOnline = (await readFile('content/shared/play-online.el.html', 'utf8')) + '\n';
const suits = ['πίκες', 'κούπες', 'καρά', 'σπαθιά'];
const ranks = { A: 'άσος', K: 'ρήγας', Q: 'ντάμα', J: 'βαλές', T: 'δέκα' };
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
for (const item of articles) {
const article = await readFile(`content/el/${item.slug}.md`, 'utf8');
let handCount = 0;
const content = article.replace(/^# [^\n]+\n/, '').replace(/♠ ([AKQJT2-9]+)  \n♥ ([AKQJT2-9]+)  \n♦ ([AKQJT2-9]+)  \n♣ ([AKQJT2-9]+)/g, (_, ...args) => {
  const cards = args.slice(0, 4);
  if (cards.join('').length !== 13) throw new Error('Χέρι χωρίς 13 φύλλα');
  for (const suit of cards) if (new Set(suit).size !== suit.length) throw new Error('Διπλό φύλλο');
  handCount++;
  return '<div class="hand">' + cards.map((s, i) => `<div class="hand-row"><span aria-hidden="true"><span class="${i === 1 || i === 2 ? 'red' : ''}">${'♠♥♦♣'[i]}</span> ${s}</span><span class="sr-only">${suits[i]}: ${[...s].map(r => ranks[r] || r).join(', ')}.</span></div>`).join('') + '</div>\n';
});
if (handCount !== item.hands) throw new Error('Μη αναμενόμενος αριθμός παραδειγμάτων');
const ids = ['when', 'purpose', 'overcalls', 'examples', 'responses', 'attention'];
const headings = [];
let html = marked.parse(content).replace(/<h2>(.*?)<\/h2>/g, (_, title) => {
  const id = ids[headings.length];
  headings.push({ id, title });
  return `<h2 id="${id}">${title}</h2>`;
}).replace(/<table>/g, '<div class="table-wrap" role="region" aria-label="Πίνακας αγορών" tabindex="0"><table>').replace(/<\/table>/g, '</table></div>').replace(/<th>/g, '<th scope="col">');
if (headings.length !== ids.length) throw new Error('Μη αναμενόμενη δομή άρθρου');

await mkdir(`site/el/${item.slug}`, { recursive: true });
await writeFile(`site/el/${item.slug}/index.html`, page({
  title: item.slug === 'multi-landy' ? 'Multi Landy: παρεμβολές στο 1ΝΤ και απαντήσεις | Leonardo Bridge' : item.title + ' | Leonardo Bridge', description: item.description, route: `el/${item.slug}/`,
  body: '<div class="layout"><nav aria-label="Περιεχόμενα άρθρου"><p class="nav-title">ΣΕ ΑΥΤΟ ΤΟ ΜΑΘΗΜΑ</p><ol>' +
    headings.map(({ id, title }) => '<li><a href="#' + id + '">' + title + '</a></li>').join('') +
    '</ol></nav><main id="main"><article><p class="eyebrow">' + item.eyebrow + '</p><h1>' + item.title + '</h1><p class="intro-label">Εφαρμογή, παραδείγματα και απαντήσεις</p>' +
    html + '</article>' + playOnline + '</main></div>'
}));
}
for (const [path, prefix, route] of [['site/index.html', '', ''], ['site/el/index.html', '../', 'el/']]) {
  await writeFile(path, page({
    title: 'Συμβάσεις μπριτζ | Leonardo Bridge',
    description: 'Συμβάσεις μπριτζ με αναλυτικές εξηγήσεις, παραδείγματα χεριών και συνέχειες αγορών.',
    route,
    body: '<main id="main" class="listing catalog"><p class="eyebrow">ΜΑΘΑΙΝΟΥΜΕ ΜΠΡΙΤΖ</p><h1>Συμβάσεις μπριτζ</h1>' +
      '<p>Εξηγήσεις, παραδείγματα χεριών και συνέχειες αγορών.</p>' +
      '<section aria-label="Διαθέσιμες συμβάσεις"><a class="card-link" href="' + prefix + 'el/multi-landy/"><strong>Multi Landy</strong><span>Παρεμβολές μετά από φυσικό άνοιγμα 1ΝΤ του αντιπάλου.</span></a><a class="card-link" href="' + prefix + 'el/michaels-cue-bid/"><strong>Michaels Cue Bid</strong><span>Δίχρωμες παρεμβολές μετά από άνοιγμα ένα σε χρώμα.</span></a></section>' +
      playOnline + '</main>'
  }));
}
console.log('Έτοιμες 4 στατικές σελίδες · Multi Landy με 8 χέρια · Michaels με 5 χέρια.');
