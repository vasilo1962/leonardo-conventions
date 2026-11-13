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
function page({ title, description, canonical, css, home, body }) {
  return `<!doctype html>\n<html lang="el"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="el" href="${canonical}"><meta property="og:type" content="article"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:locale" content="el_GR"><link rel="stylesheet" href="${css}"></head><body><a class="skip" href="#main">Στο περιεχόμενο</a><header><div class="bar"><a class="brand" href="${home}">Leonardo Bridge</a><span class="bar-label">Συμβάσεις · Ελληνικά</span></div></header>${body}<footer>Leonardo Bridge · Συμβάσεις μπριτζ</footer></body></html>\n`;
}
const description = 'Multi Landy μετά από άνοιγμα 1ΝΤ: οι παρεμβολές, οι απαντήσεις και παραδείγματα χεριών, βήμα βήμα.';
await mkdir('site/el/multi-landy', { recursive: true });
await writeFile('site/el/multi-landy/index.html', page({ title: 'Multi Landy: παρεμβολές στο 1ΝΤ και απαντήσεις | Leonardo Bridge', description, canonical: 'https://leonardobridge.com/conventions/el/multi-landy/', css: '../../assets/conventions.css', home: '../../', body: `<div class="layout"><nav aria-label="Περιεχόμενα άρθρου"><p class="nav-title">ΣΕ ΑΥΤΟ ΤΟ ΜΑΘΗΜΑ</p><ol>${headings.map(({ id, title }) => `<li><a href="#${id}">${title}</a></li>`).join('')}</ol></nav><main id="main"><article><p class="eyebrow">ΠΑΡΕΜΒΟΛΕΣ ΜΕΤΑ ΑΠΟ 1ΝΤ</p><h1>Multi Landy</h1><p class="intro-label">Εφαρμογή, παραδείγματα και απαντήσεις</p>${html}</article>${playOnline}</main></div>` }));
for (const [path, prefix] of [['site/index.html', ''], ['site/el/index.html', '../']]) {
  const link = prefix ? 'multi-landy/' : 'el/multi-landy/';
  await writeFile(path, page({ title: 'Συμβάσεις μπριτζ | Leonardo Bridge', description: 'Οδηγοί συμβάσεων μπριτζ με αναλυτικές εξηγήσεις και παραδείγματα.', canonical: `https://leonardobridge.com/conventions/${prefix ? 'el/' : ''}`, css: `${prefix}assets/conventions.css`, home: prefix || './', body: `<main id="main" class="listing"><p class="eyebrow">ΜΑΘΑΙΝΟΥΜΕ ΜΠΡΙΤΖ</p><h1>Συμβάσεις</h1><p>Αναλυτικές εξηγήσεις, παραδείγματα χεριών και βασικές συνέχειες αγορών.</p><a class="card-link" href="${link}"><strong>Multi Landy</strong><span>Παρεμβολές μετά από φυσικό άνοιγμα 1ΝΤ του αντιπάλου.</span></a></main>` }));
}
console.log(`Έτοιμες 3 στατικές σελίδες · ${handCount} χέρια με 13 φύλλα · ${headings.length} ενότητες.`);
