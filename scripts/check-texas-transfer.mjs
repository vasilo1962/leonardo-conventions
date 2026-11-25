import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {legalCalls,handCards,auctionRows} from '../site/assets/convention-exercises.js';
const data=JSON.parse(await readFile('content/exercises/texas-transfer.el.json','utf8'));
assert.equal(data.questions.length,20);
assert.equal(new Set(data.questions.map(q=>q.id)).size,20);
assert.equal(new Set(data.questions.map(q=>JSON.stringify(q.hand))).size,20);
for(const role of ['overcall','response'])assert.equal(data.questions.filter(q=>q.role===role).length,10);
assert.equal(data.questions.filter(q=>q.role==='overcall'&&q.kind==='convention').length,8);
assert.equal(data.questions.filter(q=>q.kind==='contrast').length,2);
assert.equal(data.questions.filter(q=>q.role==='response'&&q.answer==='PASS').length,5);
assert.equal(data.questions.filter(q=>q.role==='response'&&q.answer==='4NT').length,5);
const points={A:4,K:3,Q:2,J:1},ranks='AKQJT98765432';
for(const q of data.questions){
 const cards=handCards(q.hand),hcp=cards.reduce((n,c)=>n+(points[c.rank]||0),0);
 assert.equal(cards.length,13,q.id);
 assert.equal(new Set(cards.map(c=>c.suit+c.rank)).size,13,q.id);
 for(const suit of Object.values(q.hand)){
  assert.ok([...suit].every(r=>ranks.includes(r)),q.id);
  assert.equal(suit,[...suit].sort((a,b)=>ranks.indexOf(a)-ranks.indexOf(b)).join(''),q.id);
 }
 assert.ok(q.explanation.includes(`${hcp} πόντους ονέρ`),q.id);
 const major=q.hand.H.length>=5?'H':'S',minorMajor=major==='H'?'S':'H',len=q.hand[major].length;
 assert.ok(q.hand[minorMajor].length<4,q.id);
 assert.ok(q.explanation.includes(`${len}φυλλη`),q.id);
 let next='N';const history=[];
 for(const a of q.auction){
  assert.equal(a.seat,next,q.id);
  assert.ok(legalCalls(history,next).includes(a.call),q.id);
  history.push(a); next='WNES'[('WNES'.indexOf(next)+1)%4];
 }
 assert.equal(next,'S',q.id);assert.ok(legalCalls(history,'S').includes(q.answer),q.id);
 assert.deepEqual(auctionRows(history).flat().filter(x=>x&&x.call!=='?'),history);
 assert.equal(q.ntRange,'15–17');assert.equal(q.vulnerability,'None');
 assert.equal(history[0].call,'1NT');
 assert.ok(history.filter(a=>['E','W'].includes(a.seat)).every(a=>a.call==='PASS'));
 if(q.kind==='contrast'){
  if(q.objective==='weak'){assert.equal(len,6);assert.ok(hcp<=6);}
  else{assert.equal(q.objective,'five-card');assert.equal(len,5);assert.ok(hcp>=12&&hcp<=13);}
  assert.equal(q.answer,major==='H'?'2D':'2H');
 }else{
  assert.ok(len>=6);
  if(q.objective==='game')assert.ok(hcp>=10&&hcp<=11,q.id);
  else{
   assert.equal(q.objective,'keycards');assert.ok(hcp>=19&&hcp<=20,q.id);
   // No missing side-suit control before the keycard ask.
   for(const [s,holding] of Object.entries(q.hand))if(s!==major)assert.ok(/[AK]/.test(holding),q.id);
   assert.ok(q.hand[major].includes('A')&&q.hand[major].includes('K')&&q.hand[major].includes('Q'));
  }
 }
 if(q.role==='overcall'){
  assert.equal(history.length,2);
  if(q.kind==='convention')assert.equal(q.answer,major==='H'?'4D':'4H');
 }else{
  assert.equal(history.length,6);
  assert.equal(history[2].call,major==='H'?'4D':'4H');
  assert.equal(history[4].call,'4'+major);
  assert.equal(q.answer,q.objective==='game'?'PASS':'4NT');
 }
}
assert.equal(new Set(data.questions.filter(q=>q.role==='overcall').map(q=>q.situation)).size,1);
assert.equal(new Set(data.questions.filter(q=>q.role==='response').map(q=>q.situation)).size,1);
const html=await readFile('site/el/texas-transfer/practice/index.html','utf8');
assert.deepEqual(JSON.parse(html.match(/id="exercise-data">([\s\S]*?)<\/script>/)[1]),data);
assert.ok(html.includes('href="../"'));
assert.ok(html.includes('Απαντώ στο 1ΝΤ')&&html.includes('Συνεχίζω μετά το Texas'));
assert.ok(html.includes('id="exercise-score"')&&html.includes('id="previous-exercise"'));
const lesson=await readFile('site/el/texas-transfer/index.html','utf8');assert.ok(lesson.includes('href="practice/"'));
console.log('Verified Texas Transfer: 20 unique hands, 8 Texas and 2 Jacoby starts, 5 game stops and 5 keycard asks, HCP/shape/controls, neutral prompts, complete legal auctions and embedded practice data.');
