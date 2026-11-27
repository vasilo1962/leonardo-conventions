import assert from 'node:assert/strict';
import fs from 'node:fs';
import {legalCalls} from '../site/assets/convention-exercises.js';
const read=p=>fs.readFileSync(p,'utf8');
const langs=JSON.parse(read('content/i18n/languages.json'));
const base=JSON.parse(read('content/exercises/stayman.el.json'));
const hands=source=>[...source.matchAll(/^♠ (.+)  \n♥ (.+)  \n♦ (.+)  \n♣ (.+)$/gm)].map(m=>m.slice(1));
const greek=read('content/el/stayman.md');let total=0;
for(const lang of langs){
 const code=lang.code,source=read(`content/${code}/stayman.md`),data=JSON.parse(read(`content/exercises/stayman.${code}.json`));
 assert.deepEqual(hands(source),hands(greek),code);
 assert.equal((source.match(/^## /gm)||[]).length,6,code);
 assert.equal(data.questions.length,20,code);
 assert.ok(!/\{\w+\}/.test(source),code);
 if(code!=='el')assert.ok(!/[\u0370-\u03ff]/.test(source+JSON.stringify(data)),code);
 for(const [i,q]of data.questions.entries()){
  const reference=base.questions[i];
  for(const key of ['id','role','kind','objective','hand','auction','answer','vulnerability','ntRange'])assert.deepEqual(q[key],reference[key],code+': '+q.id+' '+key);
  const hcp=Object.values(q.hand).join('').split('').reduce((n,r)=>n+({A:4,K:3,Q:2,J:1}[r]||0),0);
  assert.ok(q.explanation.includes(String(hcp)),code+': HCP');
  assert.ok(q.explanation.length>=15,code+': explanation');
  assert.ok(legalCalls(q.auction).includes(q.answer));total++;
 }
 const route=code==='el'?'el/stayman/practice/':`${code}/stayman-practice/`;
 const lesson=read(`site/${code}/stayman/index.html`),practice=read(`site/${route}index.html`);
 assert.deepEqual(JSON.parse(practice.match(/id="exercise-data">([\s\S]*?)<\/script>/)[1]),data);
 assert.ok(lesson.includes(code==='el'?'href="practice/"':'href="../stayman-practice/"'));
 assert.ok(practice.includes(code==='el'?'href="../"':'href="../stayman/"'));
 assert.ok(practice.includes(`lang="${code}"`));
 if(lang.dir==='rtl'){assert.ok(lesson.includes('dir="rtl"'));assert.ok(practice.includes('dir="rtl"'));}
 assert.equal((lesson.match(/class="hand"/g)||[]).length,9);
 assert.equal((lesson.match(/class="example-row"/g)||[]).length,9);
 assert.ok(lesson.includes(`https://leonardobridge.com/${code}/stayman/`));
 assert.ok(lesson.includes('Transfer'));
}
console.log(`Verified Stayman in ${langs.length} languages: ${total} identical questions, HCP, answers, auctions, nine example hands, six sections, complete localized explanations/UI, canonical routes and RTL.`);
