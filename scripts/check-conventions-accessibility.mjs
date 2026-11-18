import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
const obsolete = /site-header|sharedHeader|headerAssets|accessibilityShell|voice-(?:intro|copy|caption|live|toggle|settings|reader)|conventions-accessibility|leonardo-wordmark|language-menu/;
let pages = 0;
async function check(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = directory + '/' + entry.name;
    if (entry.isDirectory()) { await check(path); continue; }
    if (!/\.(html|css|js)$/.test(path)) continue;
    const text = await readFile(path, 'utf8');
    assert.ok(!obsolete.test(text), path + ': obsolete independent header');
    if (!path.endsWith('.html')) continue;
    pages++;
    assert.ok(!/<header\b/.test(text), path + ': independent header');
    assert.ok(text.includes('class="skip" href="#main"'), path + ': skip link');
    assert.ok(text.includes('<main id="main"'), path + ': main landmark');
    assert.ok(/<h1(?: [^>]*)?>/.test(text), path + ': title');
    if (path.includes('/practice/')) {
      assert.ok(text.includes('id="exercise-announcement" class="sr-only" aria-live="polite" aria-atomic="true"'));
      assert.ok(text.includes('id="exercise-question" tabindex="-1"'));
      assert.ok(text.includes('id="exercise-data"'));
    }
  }
}
await check('site');
assert.equal(pages, 217);
for (const file of ['scripts/build.mjs', 'scripts/exercise-page.mjs']) assert.ok(!obsolete.test(await readFile(file, 'utf8')), file);
const css = await readFile('site/assets/conventions.css', 'utf8');
assert.ok(css.includes('.spoken-table-row:focus-visible'));
assert.ok(css.includes('[tabindex="-1"]:focus-visible'));
const exercises = await readFile('site/assets/convention-exercises.js', 'utf8');
assert.ok(exercises.includes("document.documentElement.dataset.voiceMode === 'true'"));
assert.ok(exercises.includes('feedback.focus({ preventScroll: true })'));
console.log(`Verified ${pages} pages: no independent header, accessible content landmarks, focus styles and exercise announcements retained.`);
