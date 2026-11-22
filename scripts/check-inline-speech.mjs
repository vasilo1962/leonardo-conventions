import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {bidSpeechParts, spokenBidText, accessibleInlineBids} from '../site/assets/bid-speech.js';
const copies=JSON.parse(await readFile('content/shared/bid-speech.json','utf8'));
const el=copies.el;
assert.equal(spokenBidText('Ανοίγουμε 1♣ ή 1♦ και απαντά 1♥ ή 1♠.',el),'Ανοίγουμε ένα σπαθί ή ένα καρό και απαντά μία κούπα ή μία πίκα.');
assert.equal(spokenBidText('3♠–4♣, 4♦/4♥, 2NT Jacoby, 4ΝΤ.',el),'τρεις πίκες–τέσσερα σπαθιά, τέσσερα καρά/τέσσερις κούπες, δύο χωρίς ατού Jacoby, τέσσερα χωρίς ατού.');
assert.equal(spokenBidText('♣️ ♦ ♥ ♠',el),'σπαθιά καρά κούπες πίκες');
assert.equal(spokenBidText('在1♣后叫4♦。',copies.zh),'在'+copies.zh.bids[1]['♣']+'后叫'+copies.zh.bids[4]['♦']+'。');
assert.equal(spokenBidText('2NT表示',copies.zh),copies.zh.bids[2].NT+'表示');
assert.equal(spokenBidText('4БК',copies.ru),copies.ru.bids[4].NT);
for(const copy of Object.values(copies)){
 for(const level of [1,2,3,4,5,6,7])for(const suit of ['♣','♦','♥','♠','NT']){
  const visual=level+suit;
  assert.equal(spokenBidText(visual,copy),copy.bids[level][suit]);
  assert.equal(bidSpeechParts(visual,copy).map(part=>part.text).join(''),visual);
 }
}
const input='<p>Ανοίγουμε <strong>1♣ ή 1♦</strong> και απαντά <a href="../jacoby-2nt/" title="2NT">2NT Jacoby</a>.</p>';
const rendered=accessibleInlineBids(input,el);
assert.ok(rendered.includes('href="../jacoby-2nt/" title="2NT"'));
assert.ok(rendered.includes('<span aria-hidden="true">1♣</span><span class="sr-only">ένα σπαθί</span>'));
assert.equal(accessibleInlineBids(rendered,el),rendered,'processing twice must not duplicate speech');
for(const protectedHtml of ['<head><title>Jacoby 2NT</title></head>','<script type="application/json">{"bid":"1♣"}</script>','<style>/* ♠ */</style>','<code>1♣</code>','<span aria-hidden="true">1♣</span>','<span class="sr-only">1♣</span>','<div class="hand"><span>♠ AK74</span></div>','<table><tr><td>1♣</td></tr></table>'])assert.equal(accessibleInlineBids(protectedHtml,el),protectedHtml);
for(const language of Object.keys(copies)){
 const html=await readFile(`site/${language}/splinter-opener/index.html`,'utf8');
 assert.ok(html.includes('class="spoken-bid"'),language);
 assert.ok(html.includes('<span class="sr-only">'+copies[language].bids[1]['♣']+'</span>'),language);
 assert.equal((html.match(/class="hand"/g)||[]).length,7);
}
console.log('Verified 26 languages × 35 bids, Greek prose, adjacent CJK text, notrump aliases, visible spelling, safe attributes, protected content and idempotent speech.');
