import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {legalCalls, handCards, auctionRows, contractRank} from '../site/assets/convention-exercises.js';
const data=JSON.parse(await readFile('content/exercises/splinter-opener.el.json','utf8'));
const points={A:4,K:3,Q:2,J:1};
const hcp=h=>Object.values(h).flatMap(s=>[...s]).reduce((n,c)=>n+(points[c]||0),0);
const control=s=>s.length<=1||/[AK]/.test(s);
const splinter=(m,s)=>m==='H'&&s==='S'?'3S':'4'+s;
const rule='Για να κάνουμε Splinter, χρειαζόμαστε δύναμη για μανς ακόμη και απέναντι στο ελάχιστο που υποσχέθηκε ο συμπαίκτης';
assert.equal(data.questions.length,20);
assert.equal(new Set(data.questions.map(q=>JSON.stringify(q.hand))).size,20);
assert.equal(data.questions.filter(q=>q.kind==='contrast').length,2);
for(const role of ['overcall','response'])assert.equal(data.questions.filter(q=>q.role===role).length,10);
for(const q of data.questions){
 const cards=handCards(q.hand);assert.equal(cards.length,13,q.id);assert.equal(new Set(cards.map(c=>c.suit+c.rank)).size,13,q.id);
 for(const suit of Object.values(q.hand))assert.match(suit,/^[AKQJT98765432]*$/);
 assert.ok(q.explanation.includes(hcp(q.hand)+' πόντ'),q.id+': HCP');assert.equal(q.hand[q.major].length,4);
 const history=[];let next=q.auction[0].seat;
 for(const entry of q.auction){assert.equal(entry.seat,next);assert.ok(legalCalls(history,next).includes(entry.call),q.id);history.push(entry);next='WNES'[('WNES'.indexOf(next)+1)%4];}
 assert.equal(next,'S');assert.ok(legalCalls(history).includes(q.answer),q.id);assert.deepEqual(auctionRows(history).flat().filter(c=>c&&c.call!=='?'),history);
 assert.equal(q.vulnerability,'None');
 if(q.role==='overcall'){
  assert.deepEqual(q.auction.map(e=>e.seat),['S','W','N','E']);assert.equal(q.auction[0].call,'1'+q.opening);assert.equal(q.auction[2].call,'1'+q.major);
  assert.ok(q.hand[q.opening].length>=5);assert.ok(!/Splinter|σόλο|σικάν|φυλλ|πόντ/.test(q.situation),q.id+': neutral question');
  if(q.kind==='contrast'){assert.equal(hcp(q.hand),12);assert.equal(q.answer,'2'+q.major);}
  else{
   assert.equal(hcp(q.hand),18);assert.equal(q.answer,splinter(q.major,q.shortSuit));assert.ok(q.hand[q.shortSuit].length<=1);assert.ok(!/^[AK]$/.test(q.hand[q.shortSuit]));
   const cheapest=legalCalls(history).find(c=>c.endsWith(q.shortSuit));assert.equal(contractRank(q.answer)-contractRank(cheapest),10,q.id+': double jump');
  }
 }else{
  assert.deepEqual(q.auction.map(e=>e.seat),['N','E','S','W','N','E']);assert.equal(q.auction[0].call,'1'+q.opening);assert.equal(q.auction[2].call,'1'+q.major);assert.equal(q.auction[4].call,splinter(q.major,q.shortSuit));
  if(q.objective==='stop'){assert.equal(q.answer,'4'+q.major);assert.ok([...q.hand[q.shortSuit]].reduce((n,c)=>n+(points[c]||0),0)>=5);}
  else{
   assert.equal(q.objective,'control');assert.ok(hcp(q.hand)>=15);assert.ok(!/[AKQJ]/.test(q.hand[q.shortSuit]));
   const available=legalCalls(history).filter(c=>/^[34][CDHS]$/.test(c)&&contractRank(c)<contractRank('4'+q.major)&&c.slice(1)!==q.major&&control(q.hand[c.slice(1)]));assert.equal(q.answer,available[0],q.id+': cheapest control');
  }
 }
}
assert.equal(data.questions.filter(q=>q.objective==='stop').length,5);assert.equal(data.questions.filter(q=>q.objective==='control').length,5);
assert.equal(new Set(data.questions.filter(q=>q.role==='overcall'&&q.kind==='convention').map(q=>q.opening+q.major+q.shortSuit)).size,8);
const lesson=await readFile('content/el/splinter-opener.md','utf8');assert.ok(lesson.includes(rule));assert.ok((await readFile('content/el/splinter-responder.md','utf8')).includes(rule));
const hands=[...lesson.matchAll(/♠ ([AKQJT2-9]+|—)  \n♥ ([AKQJT2-9]+|—)  \n♦ ([AKQJT2-9]+|—)  \n♣ ([AKQJT2-9]+|—)/g)].map(m=>Object.fromEntries(m.slice(1).map((s,i)=>['SHDC'[i],s==='—'?'':s])));
assert.equal(hands.length,7);assert.deepEqual(hands.map(hcp),[18,18,18,12,11,15,16]);for(const h of hands)assert.equal(handCards(h).length,13);
assert.ok(!/κοντότη|ανυψώ|παρέμβολή/i.test(lesson));assert.equal((lesson.match(/^## /gm)||[]).length,6);
const html=await readFile('site/el/splinter-opener/index.html','utf8');assert.equal((html.match(/class="hand"/g)||[]).length,7);assert.equal((html.match(/class="example-row"/g)||[]).length,7);
assert.ok(html.includes('href="../splinter-responder/"'));assert.ok(html.includes('href="practice/"'));assert.ok(html.includes('σικάν, κανένα φύλλο'));
const practice=await readFile('site/el/splinter-opener/practice/index.html','utf8');assert.deepEqual(JSON.parse(practice.match(/id="exercise-data">([\s\S]*?)<\/script>/)[1]),data);assert.ok(!practice.includes('toggle-bidding'));
const desc=JSON.parse(await readFile('content/i18n/article-descriptions.json','utf8'))['splinter-opener'].el;assert.ok(html.includes('name="description" content="'+desc+'"'));assert.ok(html.includes('property="og:description" content="'+desc+'"'));
console.log('Verified opener Splinter: 7 hands/HCP, all 8 direct auctions, 20 unique exercises, two minimum contrasts, 5 sign-offs/5 cheapest controls, 4-card major responses, common strength rule, reciprocal links and metadata.');
