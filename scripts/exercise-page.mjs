import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { sharedHeader, headerAssets, accessibilityShell } from './shared-header.mjs';

// Self-contained conventions preview; no dependency on game bundles or services.
export async function buildExercisePreview() {
  for (const file of (await readdir('content/exercises')).filter(name => name.endsWith('.el.json')).sort()) {
  const data = JSON.parse(await readFile('content/exercises/' + file, 'utf8'));
  const route = 'el/' + file.replace('.el.json', '') + '/practice/';
  const baseScript = '<script>const m=location.pathname.match(/^\\/conventions-preview\\/[a-f0-9]{40}\\//);if(m){const b=document.querySelector("base");b.href=m[0]+b.getAttribute("href").slice("/conventions/".length);}</script>';
  const html = `<!doctype html>
<html lang="el"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<base href="/conventions/${route}">${baseScript}
<title>${data.title} · Ασκήσεις | Leonardo Bridge</title>
<meta name="description" content="Δοκιμή ασκήσεων ${data.title}: παρεμβολές και απαντήσεις στον συμπαίκτη, με το χέρι σου και bidding box.">
<meta name="robots" content="noindex">
<link rel="canonical" href="https://leonardobridge.com/conventions/${route}">
<link rel="stylesheet" href="../../../assets/conventions.css"><link rel="stylesheet" href="../../../assets/convention-exercises.css">
${headerAssets("../../../")}<script type="module" src="../../../assets/convention-exercises.js"></script></head>
<body class="exercise-page"><a class="skip" href="#main">Στο περιεχόμενο</a>
${sharedHeader({prefix:"../../../",language:"el",links:'<a href="../../../el/">Συμβάσεις</a><a href="../">Το μάθημα</a>'})}
<main id="main" class="exercise-main">
<div class="exercise-heading"><div><p class="eyebrow">ΔΟΚΙΜΗ ΑΣΚΗΣΕΩΝ</p><h1>${data.title}</h1></div><a class="lesson-return" href="../">Πίσω στο μάθημα</a></div>
<p class="exercise-intro">Βλέπεις μόνο το χέρι σου. Διάλεξε την αγορά σου από το bidding box.</p>
<div class="exercise-modes" role="group" aria-label="Είδος άσκησης"><button type="button" data-mode="overcall" aria-pressed="true">Κάνω παρεμβολή</button><button type="button" data-mode="response" aria-pressed="false">Απαντώ στον συμπαίκτη</button></div>
<div class="exercise-progress"><p id="exercise-progress">Άσκηση 1 από 10</p><p id="exercise-context">Χωρίς μανς</p></div>
<section class="exercise-table" aria-label="Τραπέζι άσκησης ${data.title}">
<h2 id="exercise-question" tabindex="-1">Τι αγοράζεις;</h2>
<p class="exercise-situation" id="exercise-situation"></p>
<div class="exercise-auction" id="exercise-auction"></div>
<div class="exercise-bidding-area"><button type="button" id="toggle-bidding" aria-expanded="true" aria-controls="exercise-bidding" hidden>ΑΠΟΚΡΥΨΗ</button><div id="exercise-bidding" class="exercise-bidding" aria-label="Bidding box"></div></div>
<div class="exercise-south"><div class="exercise-cards" id="exercise-hand" role="list" aria-label="Το χέρι σου, 13 φύλλα"></div><div class="exercise-position"><span class="south-symbol" aria-hidden="true">S</span><span>Εσύ · Νότος</span><span class="turn-label">Η σειρά σου</span></div></div>
</section>
<section class="exercise-feedback" id="exercise-feedback" aria-label="Αποτέλεσμα" hidden><h2 id="feedback-title"></h2><p id="feedback-answer"></p><p id="feedback-explanation"></p><button type="button" id="next-exercise">Επόμενη άσκηση</button></section>
<section class="exercise-summary" id="exercise-summary" tabindex="-1" hidden><h2>Ολοκλήρωσες την ομάδα</h2><p id="summary-score"></p><button type="button" id="continue-responses" hidden>Απαντώ στον συμπαίκτη</button><button type="button" id="restart-exercises">Ξανά με τα ίδια χέρια</button><a href="../">Επιστροφή στο μάθημα</a></section>
<p id="exercise-announcement" class="sr-only" aria-live="polite" aria-atomic="true"></p>
<noscript><p>Για τις διαδραστικές ασκήσεις χρειάζεται JavaScript. <a href="../">Μπορείς να διαβάσεις το μάθημα ${data.title}.</a></p></noscript>
<script type="application/json" id="exercise-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
</main><footer>Leonardo Bridge · Ασκήσεις συμβάσεων</footer>${accessibilityShell("el")}</body></html>
`;
  await mkdir('site/' + route, { recursive: true });
  await writeFile('site/' + route + 'index.html', html);
  }
}
