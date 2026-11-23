import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {articles,availableIn} from './articles.mjs';
const languages=JSON.parse(await readFile('content/i18n/languages.json','utf8'));
const reference=JSON.parse(await readFile('content/exercises/jacoby-transfers.el.json','utf8'));
const lesson=articles.find(a=>a.slug==='jacoby-transfers');
let count=0;
for(const language of languages){
 const code=language.code;
 assert.ok(availableIn(lesson,code));
 const data=JSON.parse(await readFile(`content/exercises/jacoby-transfers.${code}.json`,'utf8'));
 assert.equal(data.language,code);
 assert.equal(data.questions.length,20);
 for(const [i,q] of data.questions.entries()){
  const {situation,explanation,...actual}=q;
  const {situation:originalSituation,explanation:originalExplanation,...expected}=reference.questions[i];
  assert.deepEqual(actual,expected,`${code}/${q.id}: changed exercise`);
  assert.ok(situation&&explanation);
  assert.ok(!explanation.includes("**"), `${code}: Markdown in plain-text feedback`);
  if(code!=='el'){
   assert.ok(!/[\u0370-\u03ff]/.test(situation+explanation));
   assert.equal(Object.keys(data.ui.locale).length,41);
   assert.deepEqual(Object.keys(data.ui.suitNames).sort(),['C','D','H','NT','S']);
   assert.ok(data.ui.locale.pass&&data.ui.locale.rightBid&&data.ui.locale.turn);
  }
  count++;
 }
 const html=await readFile(`site/${data.route || code+'/jacoby-transfers/practice/'}index.html`,'utf8');
 assert.ok(html.includes(`<html lang="${code}"${language.dir==='rtl'?' dir="rtl"':''}>`));
 assert.deepEqual(JSON.parse(html.match(/id="exercise-data">([\s\S]*?)<\/script>/)[1]),data);
 assert.ok(html.includes('id="previous-exercise"')&&html.includes('id="exercise-score"'));
 if(code!=='el')assert.ok(!/[\u0370-\u03ff]/.test(html),`${code}: Greek UI remains`);
 assert.ok((await readFile(`site/${code}/jacoby-transfers/index.html`,'utf8')).includes('href="'+(lesson.exerciseUi?.[code]?.href || 'practice/')+'"'));
}
console.log(`Verified ${languages.length} localized Jacoby Transfer lessons and ${count} exercises: identical hands, auctions, answers and objectives; localized UI, card speech and feedback; same-language exercise links.`);
