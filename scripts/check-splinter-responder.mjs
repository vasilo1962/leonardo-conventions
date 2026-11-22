import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { legalCalls, handCards, auctionRows } from '../site/assets/convention-exercises.js';
const data = JSON.parse(await readFile('content/exercises/splinter-responder.el.json','utf8'));
const points = {A:4,K:3,Q:2,J:1};
const order = 'AKQJT98765432';
const strength = hand => Object.values(hand).flatMap(s => [...s]).reduce((sum,c) => sum + (points[c] || 0),0);
assert.equal(data.questions.length,20);
assert.equal(new Set(data.questions.map(q => JSON.stringify(q.hand))).size,20);
for (const role of ['overcall','response']) assert.equal(data.questions.filter(q => q.role===role).length,10);
assert.equal(data.questions.filter(q => q.kind==='contrast').length,2);
const splinter = (major,short) => major==='H' && short==='S' ? '3S' : '4'+short;
const controlled = cards => cards.length<=1 || /[AK]/.test(cards);
for (const q of data.questions) {
  const cards=handCards(q.hand);
  assert.equal(cards.length,13,q.id);
  assert.equal(new Set(cards.map(c=>c.suit+c.rank)).size,13,q.id);
  for (const suit of Object.values(q.hand)) {
    assert.match(suit,/^[AKQJT98765432]*$/);
    assert.deepEqual([...suit], [...suit].sort((a,b)=>order.indexOf(a)-order.indexOf(b)),q.id);
  }
  assert.ok(q.explanation.includes(strength(q.hand)+' πόντ'),q.id+': HCP');
  let seat=q.auction[0].seat;
  const history=[];
  for (const entry of q.auction) {
    assert.equal(entry.seat,seat,q.id+': turn order');
    assert.ok(legalCalls(history,seat).includes(entry.call),q.id+': legal history');
    history.push(entry);seat='WNES'[('WNES'.indexOf(seat)+1)%4];
  }
  assert.equal(seat,'S');assert.ok(legalCalls(history).includes(q.answer),q.id+': legal answer');
  assert.deepEqual(auctionRows(history).flat().filter(x=>x&&x.call!=='?'),history);
  assert.equal(q.vulnerability,'None');
  if(q.role==='overcall') {
    assert.deepEqual(q.auction.map(x=>x.seat),['N','E']);
    assert.ok(!/Splinter|Jacoby|σόλο|σικάν|φυλλ|πόντ/.test(q.situation),q.id+': neutral prompt');
    assert.equal(q.hand[q.major].length,4);
    if(q.kind==='contrast') {
      assert.equal(q.answer,'2NT');
      assert.ok(Object.values(q.hand).every(s=>s.length>=2)||strength(q.hand)>=20);
    } else {
      assert.equal(strength(q.hand),13);
      const short=Object.entries(q.hand).filter(([s,c])=>s!==q.major&&c.length<=1);
      assert.equal(short.length,1);assert.equal(short[0][0],q.shortSuit);
      assert.ok(!/^[AK]$/.test(short[0][1]));assert.equal(q.answer,splinter(q.major,q.shortSuit));
    }
  } else {
    assert.deepEqual(q.auction.map(x=>x.seat),['S','W','N','E']);
    assert.equal(q.auction[2].call,splinter(q.major,q.shortSuit));
    assert.ok(q.hand[q.major].length>=5);
    if(q.objective==='stop') {
      assert.equal(q.answer,'4'+q.major);
      assert.ok([...q.hand[q.shortSuit]].reduce((n,c)=>n+(points[c]||0),0)>=5);
    } else {
      assert.equal(q.objective,'control');assert.ok(strength(q.hand)>=16);
      assert.ok(!/[AKQJ]/.test(q.hand[q.shortSuit]));
      const choices=legalCalls(history).filter(c=>/^4[CDHS]$/.test(c)&&c!=='4'+q.major);
      const rank=c=>'CDHS'.indexOf(c.slice(1));
      const available=choices.filter(c=>rank(c)<rank('4'+q.major)&&controlled(q.hand[c.slice(1)]));
      assert.equal(q.answer,available[0],q.id+': lowest control below game');
    }
  }
}
const lesson=await readFile('content/el/splinter-responder.md','utf8');
const hands=[...lesson.matchAll(/♠ ([AKQJT2-9]+|—)  \n♥ ([AKQJT2-9]+|—)  \n♦ ([AKQJT2-9]+|—)  \n♣ ([AKQJT2-9]+|—)/g)].map(m=>m.slice(1).map(s=>s==='—'?'':s));
assert.equal(hands.length,7);
for(const h of hands) { assert.equal(h.join('').length,13);for(const suit of h)assert.equal(new Set(suit).size,suit.length); }
assert.deepEqual(hands.map(h=>strength(Object.fromEntries(h.map((s,i)=>['SHDC'[i],s])))),[13,13,13,16,13,18,16]);
assert.ok(!/κοντότη|ανυψώ|παρέμβολή/i.test(lesson));
const html=await readFile('site/el/splinter-responder/index.html','utf8');
assert.equal((html.match(/class="hand"/g)||[]).length,7);
assert.ok(html.includes('σικάν, κανένα φύλλο'));
assert.ok(html.includes('href="practice/"'));
assert.ok(html.includes('href="../splinter-opener/"'));
const exercises=await readFile('site/el/splinter-responder/practice/index.html','utf8');
assert.deepEqual(JSON.parse(exercises.match(/id="exercise-data">([\s\S]*?)<\/script>/)[1]),data);
const description=JSON.parse(await readFile('content/i18n/article-descriptions.json','utf8'))['splinter-responder'].el;
assert.ok(html.includes('name="description" content="'+description+'"'));
assert.ok(html.includes('property="og:description" content="'+description+'"'));
console.log('Verified Splinter: 7 example hands/HCP, accessible void, 20 unique legal exercises, 8 splinters/2 contrasts, 5 sign-offs/5 lowest controls, neutral prompts, metadata and lesson/practice links.');
