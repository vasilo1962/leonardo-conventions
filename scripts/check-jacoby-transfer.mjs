import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { legalCalls, handCards, auctionRows } from '../site/assets/convention-exercises.js';
const data=JSON.parse(await readFile('content/exercises/jacoby-transfer.el.json','utf8'));
const points={A:4,K:3,Q:2,J:1};
assert.equal(data.questions.length,20);
assert.equal(new Set(data.questions.map(q=>q.id)).size,20);
assert.equal(new Set(data.questions.map(q=>JSON.stringify(q.hand))).size,20);
for(const role of ['overcall','response'])assert.equal(data.questions.filter(q=>q.role===role).length,10);
assert.equal(data.questions.filter(q=>q.role==='overcall'&&q.kind==='convention').length,8);
assert.equal(data.questions.filter(q=>q.role==='overcall'&&q.kind==='contrast').length,2);
const expectedCounts={partscore:2,'invitation-5':2,'invitation-6':2,'game-5':2,'game-6':2};
for(const [goal,count] of Object.entries(expectedCounts))assert.equal(data.questions.filter(q=>q.objective===goal).length,count);
for(const q of data.questions){
 const cards=handCards(q.hand),hcp=cards.reduce((a,c)=>a+(points[c.rank]||0),0);
 assert.equal(cards.length,13,q.id);assert.equal(new Set(cards.map(c=>c.suit+c.rank)).size,13,q.id);
 assert.ok(q.explanation.includes(`${hcp} πόντους από ονέρ`),q.id);
 for(const s of Object.values(q.hand))assert.equal(s,[...s].sort((a,b)=>'AKQJT98765432'.indexOf(a)-'AKQJT98765432'.indexOf(b)).join(''));
 const major=q.hand.H.length>=5?'H':'S',len=q.hand[major].length;
 if(q.kind!=='contrast'){assert.ok(len>=5);assert.ok(q.hand[major==='H'?'S':'H'].length<4);}
 let next='N';const history=[];
 for(const a of q.auction){assert.equal(a.seat,next,q.id);assert.ok(legalCalls(history,next).includes(a.call),q.id);history.push(a);next='WNES'[('WNES'.indexOf(next)+1)%4];}
 assert.equal(next,'S');assert.ok(legalCalls(history).includes(q.answer),q.id);
 assert.deepEqual(auctionRows(history).flat().filter(x=>x&&x.call!=='?'),history);
 assert.equal(q.auction[0].call,'1NT');assert.equal(q.ntRange,'15–17');assert.equal(q.vulnerability,'None');
 if(q.role==='overcall'){assert.equal(q.auction.length,2);if(q.kind==='contrast'){
  assert.ok(hcp>=12&&hcp<=13);
  if(q.objective==='no-transfer-diamonds'){assert.equal(q.hand.D.length,6);assert.ok(Math.max(q.hand.H.length,q.hand.S.length)<4);assert.equal(q.answer,'3NT');}
  else{assert.equal(q.objective,'stayman');assert.equal(Math.max(q.hand.H.length,q.hand.S.length),4);assert.equal(q.answer,'2C');}
 }else assert.equal(q.answer,major==='H'?'2D':'2H');}
 else{
  assert.equal(q.auction.length,6);assert.equal(q.auction[2].call,major==='H'?'2D':'2H');assert.equal(q.auction[4].call,'2'+major,'No superaccept');
  if(q.objective==='partscore'){assert.ok(hcp<=7);assert.equal(q.answer,'PASS');}
  if(q.objective.startsWith('invitation')){assert.ok(hcp>=8&&hcp<=9);assert.equal(q.answer,len===5?'2NT':'3'+major);}
  if(q.objective.startsWith('game')){assert.ok(hcp>=10&&hcp<=13);assert.equal(q.answer,len===5?'3NT':'4'+major);}
 }
}
const lesson=await readFile('site/el/jacoby-transfer/index.html','utf8');
assert.equal((lesson.match(/class="hand"/g)||[]).length,8);
assert.equal((lesson.match(/class="example-row"/g)||[]).length,8);
assert.equal((lesson.match(/<h2 id=/g)||[]).length,6);
assert.ok(lesson.includes('href="practice/"'));
assert.ok(lesson.includes('paragraph-speech sr-only'));
const html=await readFile('site/el/jacoby-transfer/practice/index.html','utf8');
assert.deepEqual(JSON.parse(html.match(/id="exercise-data">([\s\S]*?)<\/script>/)[1]),data);
assert.ok(html.includes('Απαντώ στο 1ΝΤ')&&html.includes('Συνεχίζω μετά το Transfer'));
assert.ok(html.includes('id="previous-exercise"'));
console.log('Verified Jacoby Transfer: 8 examples, 20 unique legal hands, all five responder continuations, 8 initial transfers and 2 non-transfer contrasts, full auction, shared counters/back navigation and speech.');
