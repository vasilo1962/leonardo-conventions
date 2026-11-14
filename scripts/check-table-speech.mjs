import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {tableTextSpeech} from './table-speech.mjs';
assert.equal(tableTextSpeech('<strong>1♣</strong>','el'),'ένα σπαθί');
assert.equal(tableTextSpeech('2♥ / 2♠','el'),'δύο κούπες / δύο πίκες');
assert.equal(tableTextSpeech('1ΝΤ','el'),'ένα χωρίς ατού');
assert.equal(tableTextSpeech('2NT','fr'),'2 sans atout');
assert.equal(tableTextSpeech('1♠','en'),'one spade');
const languages=JSON.parse(await readFile('content/i18n/languages.json','utf8'));
let rows=0;
for(const lang of languages)for(const slug of ['multi-landy','michaels-cue-bid','unusual-2nt','dont']){
 const html=await readFile(`site/${lang.code}/${slug}/index.html`,'utf8');
 const tables=[...html.matchAll(/<table>([\s\S]*?)<\/table>/g)];assert.ok(tables.length);
 for(const [,table]of tables){
  const names=[...table.matchAll(/<tr class="spoken-table-row" tabindex="0" aria-label="([^"]+)">/g)].map(m=>m[1]);
  assert.equal(names.length,(table.match(/<td>/g)||[]).length/((table.match(/<th /g)||[]).length));
  for(const name of names){assert.ok(name.length>0);assert.ok(!/[♣♦♥♠]/.test(name));assert.ok(!/undefined/.test(name));rows++;}
  assert.equal((table.match(/<td>/g)||[]).length+(table.match(/<th /g)||[]).length,(table.match(/class="table-cell-speech sr-only"/g)||[]).length);
 }
 assert.ok(!html.includes('aria-label="'+lang.ui.table+'" tabindex="0"'));
}
const el=await readFile('site/el/michaels-cue-bid/index.html','utf8');assert.ok(el.includes('Άνοιγμα αντιπάλου: ένα σπαθί. Αγορά μας: δύο σπαθιά. Χρώματα που δείχνουμε: Τουλάχιστον 5 κούπες και 5 πίκες.'));
console.log(`Verified ${rows} spoken table rows in 26 languages: column context, named bids, hidden visual symbols, native cells and keyboard focus.`);
