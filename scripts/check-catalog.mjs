import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { articles, availableIn } from './articles.mjs';

const languages = JSON.parse(await readFile('content/i18n/languages.json', 'utf8'));
const ui = JSON.parse(await readFile('content/i18n/catalog-topics.json', 'utf8'));
const client = await readFile('site/assets/catalog.js', 'utf8');
for (const language of languages) {
  const html = await readFile(`site/${language.code}/conventions/index.html`, 'utf8');
  const rows = [...html.matchAll(/<div class="convention-entry" data-convention="([^"]+)" data-topics="([^"]+)">([\s\S]*?)<\/div><\/div>/g)];
  assert.equal(rows.length, articles.filter(article => availableIn(article, language.code)).length);
  const title = row => row[3].match(/<strong[^>]*>(.*?)<\/strong>/)[1];
  const collator = new Intl.Collator(language.code, { sensitivity: 'base', numeric: true });
  for (let i = 1; i < rows.length; i++) assert.ok(collator.compare(title(rows[i-1]), title(rows[i])) <= 0, `${language.code}: catalog order`);
  for (const row of rows) {
    assert.ok(!row[3].includes('<span>'), 'Old catalog description');
    assert.ok(row[3].includes('class="catalog-tags" role="group"'));
    assert.ok(!row[3].includes('level'), 'Levels are deferred');
    for (const topic of row[2].split(' ')) assert.ok(ui[language.code].labels[topic]);
  }
  assert.ok(html.includes('class="catalog-filters" hidden'));
  assert.ok(html.includes('role="status" aria-live="polite" aria-atomic="true"'));
  const filters = html.slice(html.indexOf('<fieldset'), html.indexOf('</fieldset>'));
  const controls = [...filters.matchAll(/data-topic="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(controls).size, controls.length);
  const expected = topic => rows.filter(row => topic === 'all' || row[2].split(' ').includes(topic)).map(row => row[1]);
  assert.deepEqual(expected('two-suited').sort(), ['dont','michaels-cue-bid','multi-landy','unusual-2nt']);
  assert.deepEqual(expected('late-opening-responses').sort(), ['drury','two-way-drury']);

  // Execute the browser module against catalog controls; exercise both filter and row-tag actions.
  const entries = rows.map(row => ({ slug: row[1], dataset: { topics: row[2] }, hidden: false }));
  const button = topic => ({ dataset: { topic }, attributes: {}, disabled: true, setAttribute(k,v) {this.attributes[k]=v;}, addEventListener(type, listener) { this[type]=listener; } });
  const buttons = [...controls.map(button), ...rows.flatMap(row => row[2].split(' ').map(button))];
  const status = { dataset: { results: ui[language.code].results }, textContent: '' };
  const fieldset = { hidden: true };
  const catalog = { querySelectorAll: selector => selector === '.convention-entry' ? entries : buttons, querySelector: selector => selector === '#catalog-status' ? status : fieldset };
  runInNewContext(client, { document: { querySelector: () => catalog } });
  assert.equal(fieldset.hidden, false);
  assert.ok(buttons.every(b => !b.disabled));
  for (const topic of [...controls, ...controls.slice().reverse(), 'all']) {
    buttons.find(b => b.dataset.topic === topic).click();
    assert.deepEqual(entries.filter(e => !e.hidden).map(e => e.slug), expected(topic));
    assert.equal(status.textContent, ui[language.code].results.replace('{count}', String(expected(topic).length)));
    assert.ok(buttons.every(b => b.attributes['aria-pressed'] === String(b.dataset.topic === topic)));
  }
  buttons.filter(b => b.dataset.topic === 'two-suited').at(-1).click();
  assert.equal(entries.filter(e => !e.hidden).length, 4);
  buttons.find(b => b.dataset.topic === 'all').click();
  assert.equal(entries.filter(e => !e.hidden).length, rows.length);
}
console.log('Verified 26 catalogs: alphabetical local titles, all topic memberships, row tags, filter switching/reset, translated status and pressed states.');
