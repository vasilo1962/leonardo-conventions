import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {legalCalls,handCards,auctionRows} from '../site/assets/convention-exercises.js';

const data=JSON.parse(await readFile('content/exercises/jacoby-superaccept.el.json','utf8'));
const points={A:4,K:3,Q:2,J:1};
const hcp=h=>handCards(h).reduce((n,c)=>n+(points[c.rank]||0),0);
const key=h=>'SHDC'.split('').map(s=>h[s]).join('/');
const control=(h,s)=>h[s].length<=1||/[AK]/.test(h[s]);
assert.equal(data.questions.length,20);
assert.equal(new Set(data.questions.map(q=>q.id)).size,20);
assert.equal(new Set(data.questions.map(q=>key(q.hand))).size,20);
for(const role of ['overcall','response'])assert.equal(data.questions.filter(q=>q.role===role).length,10);
const previous=new Set();
for(const file of await readdir('content/exercises'))if(file.endsWith('.json')&&!file.startsWith('jacoby-superaccept.')){
 const old=JSON.parse(await readFile('content/exercises/'+file,'utf8'));
 for(const q of old.questions)previous.add(key(q.hand));
}
for(const q of data.questions){
 const cards=handCards(q.hand);
 assert.equal(cards.length,13,q.id);
 assert.equal(new Set(cards.map(c=>c.suit+c.rank)).size,13,q.id);
 assert.ok(!previous.has(key(q.hand)),q.id+': previously used hand');
 assert.ok(q.explanation.includes(`${hcp(q.hand)} πόντους ονέρ`),q.id+': HCP explanation');
 for(const s of Object.values(q.hand))assert.equal(s,[...s].sort((a,b)=>'AKQJT98765432'.indexOf(a)-'AKQJT98765432'.indexOf(b)).join(''));
 let next=q.auction[0].seat;const history=[];
 for(const a of q.auction){
  assert.equal(a.seat,next,q.id);
  assert.ok(legalCalls(history,next).includes(a.call),q.id+': '+a.call);
  history.push(a);next='WNES'[('WNES'.indexOf(next)+1)%4];
 }
 assert.equal(next,'S',q.id+': user turn');
 assert.ok(legalCalls(history).includes(q.answer),q.id+': legal answer');
 assert.deepEqual(auctionRows(history).flat().filter(x=>x&&x.call!=='?'),history);
 assert.equal(q.ntRange,'15–17');assert.equal(q.vulnerability,'None');
 const transfer=q.major==='H'?'2D':'2H';
 if(q.role==='overcall'){
  assert.equal(q.auction.length,4);assert.equal(q.auction[0].seat,'S');assert.equal(q.auction[0].call,'1NT');assert.equal(q.auction[2].call,transfer);
  assert.deepEqual(Object.values(q.hand).map(s=>s.length).sort(),q.objective==='flat'?[3,3,3,4]:[2,3,4,4]);
  const qualifies=hcp(q.hand)===17&&q.hand[q.major].length===4;
  let expected='2'+q.major;
  if(qualifies){
   const short=Object.keys(q.hand).find(s=>q.hand[s].length===2);
   expected=!short?'3'+q.major:short===transfer.slice(1)?'2NT':short==='S'?'2S':'3'+short;
  }
  assert.equal(q.answer,expected,q.id+': superaccept mapping');
  assert.equal(q.kind,qualifies?'convention':'contrast');
 }else{
  assert.equal(q.auction[0].seat,'N');assert.equal(q.auction[2].call,transfer);
  assert.equal(q.auction[4].call,q.superaccept);assert.equal(q.kind,'convention');
  assert.equal(q.hand[q.major].length,5);
  const flat=q.superaccept==='3'+q.major;
  if(q.objective.startsWith('partscore')){
   assert.ok(hcp(q.hand)<=4);assert.equal(q.answer,flat?'PASS':q.major==='H'?'3D':'3H');
  }else if(q.objective.startsWith('game')){
   assert.ok(hcp(q.hand)>=10&&hcp(q.hand)<=12);assert.equal(q.answer,flat?'4'+q.major:q.major==='H'?'4D':'4H');
  }else if(q.objective==='slam-control'){
   assert.equal(hcp(q.hand),17);
   assert.ok(control(q.hand,q.answer.slice(1)));
   const missing='SHDC'.split('').filter(s=>s!==q.major&&!control(q.hand,s));
   assert.equal(missing.length,1);
   assert.notEqual(q.answer,q.major==='H'?'3D':'3H');
   assert.notEqual(q.answer,q.major==='H'?'4D':'4H');
  }else{
   assert.equal(q.objective,'slam-keycards');assert.equal(q.answer,'4NT');assert.equal(hcp(q.hand),17);
   for(const s of 'SHDC')if(s!==q.major)assert.ok(control(q.hand,s));
  }
  assert.ok([6,10].includes(q.auction.length));
 }
}
assert.equal(data.questions.filter(q=>q.role==='overcall'&&q.kind==='contrast').length,2);
for(const [prefix,count] of [['partscore',3],['game',3],['slam-control',2],['slam-keycards',2]])assert.equal(data.questions.filter(q=>q.objective.startsWith(prefix)).length,count);
const html=await readFile('site/el/jacoby-transfer-superaccept/practice/index.html','utf8');
assert.deepEqual(JSON.parse(html.match(/id="exercise-data">([\s\S]*?)<\/script>/)[1]),data);
assert.ok(html.includes('id="previous-exercise"'));
assert.ok(html.includes('href="../"'));
assert.ok((await readFile('site/el/jacoby-transfer-superaccept/index.html','utf8')).includes('href="practice/"'));
console.log('Verified 20 unique hands, HCP, 8 superaccepts/2 contrasts, both roles and full legal auctions, 3 signoffs/3 games/2 controls/2 keycard asks, embedded data and reciprocal links.');
