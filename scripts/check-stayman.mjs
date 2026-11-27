import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {legalCalls,handCards,auctionRows} from '../site/assets/convention-exercises.js';
const data=JSON.parse(await readFile('content/exercises/stayman.el.json','utf8'));
const questions=data.questions,points={A:4,K:3,Q:2,J:1},ranks='AKQJT98765432';
assert.equal(questions.length,20);
assert.equal(new Set(questions.map(q=>q.id)).size,20);
assert.equal(new Set(questions.map(q=>JSON.stringify(q.hand))).size,20);
for(const role of ['overcall','response'])assert.equal(questions.filter(q=>q.role===role).length,10);
assert.equal(questions.filter(q=>q.role==='overcall'&&q.kind==='convention').length,8);
assert.equal(questions.filter(q=>q.kind==='contrast').length,2);
const expectedHcp=[9,8,10,10,9,10,8,10,4,12,15,17,16,9,12,9,12,15,15,17];
for(const [index,q] of questions.entries()){
 const cards=handCards(q.hand),hcp=cards.reduce((n,c)=>n+(points[c.rank]||0),0),len=s=>q.hand[s].length;
 assert.equal(cards.length,13,q.id);assert.equal(new Set(cards.map(c=>c.suit+c.rank)).size,13,q.id);
 assert.equal(hcp,expectedHcp[index],q.id);assert.ok(q.explanation.includes(`${hcp} πόντους ονέρ`),q.id);
 for(const holding of Object.values(q.hand))assert.equal(holding,[...holding].sort((a,b)=>ranks.indexOf(a)-ranks.indexOf(b)).join(''),q.id);
 let next=q.auction[0].seat;const history=[];
 for(const a of q.auction){
  assert.equal(a.seat,next,q.id);assert.ok(legalCalls(history,next).includes(a.call),q.id);
  history.push(a);next='WNES'[('WNES'.indexOf(next)+1)%4];
 }
 assert.equal(next,'S',q.id);assert.ok(legalCalls(history,'S').includes(q.answer),q.id);
 assert.deepEqual(auctionRows(history).flat().filter(x=>x&&x.call!=='?'),history,q.id);
 assert.ok(history.filter(a=>['E','W'].includes(a.seat)).every(a=>a.call==='PASS'),q.id);
 assert.equal(q.ntRange,'15–17');assert.equal(q.vulnerability,'None');
 if(q.role==='overcall'){
  assert.deepEqual(history.map(a=>a.call),['1NT','PASS']);
  if(q.kind==='convention'){
   assert.ok(len('S')===4||len('H')===4,q.id);assert.ok(Math.max(len('S'),len('H'))===4,q.id);
   assert.ok(hcp>=8&&hcp<=12,q.id);assert.equal(q.answer,'2C');
   assert.equal(q.objective,hcp<=9?'invitation':'game');
  }else if(q.objective==='weak-balanced'){
   assert.equal(q.answer,'PASS');assert.ok(hcp<6);assert.equal(len('S'),4);assert.deepEqual(Object.values(q.hand).map(h=>h.length).sort(),[3,3,3,4]);
  }else{
   assert.equal(q.answer,'3NT');assert.ok(len('S')<4&&len('H')<4&&hcp>=11);
  }
 }else{
  assert.equal(history[2].call,'2C',q.id);
  if(q.objective.startsWith('opener-')){
   assert.equal(history.length,4);assert.equal(history[0].seat,'S');
   assert.ok(hcp>=15&&hcp<=17);assert.ok(Math.min(...Object.values(q.hand).map(h=>h.length))>=2);
   assert.equal(q.answer,len('H')===4?'2H':len('S')===4?'2S':'2D');
  }else if(q.objective.startsWith('recover-')){
   assert.equal(history.length,8);assert.equal(history[0].seat,'S');
   assert.equal(history[4].call,'2H');assert.equal(len('H'),4);assert.equal(len('S'),4);
   if(q.objective==='recover-game'){assert.equal(history[6].call,'3NT');assert.equal(q.answer,'4S');}
   else {assert.equal(history[6].call,'2NT');assert.equal(hcp,q.objective==='recover-minimum'?15:17);assert.equal(q.answer,hcp===15?'3S':'4S');}
  }else{
   assert.equal(history.length,6);assert.equal(history[0].seat,'N');
   const reply=history[4].call;
   if(q.objective.startsWith('fit-')){
    assert.equal(len(reply.slice(1)),4);assert.equal(q.answer,(hcp<=9?'3':'4')+reply.slice(1));
   }else{
    assert.equal(q.answer,hcp<=9?'2NT':'3NT');
    assert.ok(reply==='2D'||len(reply.slice(1))<4);
    if(reply==='2H'){assert.equal(len('S'),4);assert.ok(len('H')<4);}
   }
  }
 }
}
const html=await readFile('site/el/stayman/practice/index.html','utf8');
assert.deepEqual(JSON.parse(html.match(/id="exercise-data">([\s\S]*?)<\/script>/)[1]),data);
for(const id of ['previous-exercise','forward-exercise','exercise-score','exercise-progress'])assert.ok(html.includes(`id="${id}"`));
assert.ok(html.includes('href="../"'));
assert.ok((await readFile('site/el/stayman/index.html','utf8')).includes('href="practice/"'));
assert.equal(new Set(questions.filter(q=>q.role==='response').map(q=>q.situation)).size,1);
console.log('Verified Stayman: 20 unique hands, 8 uses/2 contrasts, 3 opener replies, fit/NT invitations and games, spade recovery at minimum/maximum, exact HCP/shape, neutral prompts and complete legal auctions.');
