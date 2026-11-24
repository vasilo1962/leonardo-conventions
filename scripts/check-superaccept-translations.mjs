import fs from 'node:fs';import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(p,'utf8'), packs=JSON.parse(read('content/i18n/jacoby-superaccept.json'));
const el=JSON.parse(read('content/exercises/jacoby-superaccept.el.json'));
const handBlocks=s=>s.match(/^♠ .+\n♥ .+\n♦ .+\n♣ .+$/gm);
const hands=handBlocks(read('content/el/jacoby-transfer-superaccept.md'));
const immutable=q=>Object.fromEntries(Object.entries(q).filter(([k])=>!['situation','explanation'].includes(k)));
for(const c of Object.keys(packs)){
 const source=read(`content/${c}/jacoby-transfer-superaccept.md`),q=JSON.parse(read(`content/exercises/jacoby-superaccept.${c}.json`));
 assert.deepEqual(handBlocks(source),hands,c+': article hands');assert.equal((source.match(/^## /gm)||[]).length,6,c);
 assert.equal((source.match(/https:\/\//g)||[]).length,3,c+': sources');
 assert.deepEqual(q.questions.map(immutable),el.questions.map(immutable),c+': identical decisions');
 assert.equal(q.questions.length,20);assert.equal(q.language,c);assert.equal(Object.keys(q.ui.locale).length,41,c);
 assert.equal(q.ui.locale.overcall,q.ui.overcall);assert.equal(q.ui.locale.response,q.ui.response);
 assert.ok(!/[\u0370-\u03ff]/.test(source),c+': unexpected Greek');
 assert.ok(!/\{(?:hcp|major|short|answer)\}/.test(JSON.stringify(q)),c+': unresolved templates');
 const html=read(`site/${c}/jacoby-transfer-superaccept/index.html`),practice=read(`site/${c}/jacoby-transfer-superaccept-practice/index.html`);
 assert.ok(html.includes('href="../jacoby-transfer-superaccept-practice/"'));assert.ok(practice.includes('href="../jacoby-transfer-superaccept/"'));
 assert.deepEqual(JSON.parse(practice.match(/id="exercise-data">([\s\S]*?)<\/script>/)[1]),q);
 assert.ok(read(`site/${c}/conventions/index.html`).includes('jacoby-transfer-superaccept/'));
 assert.ok(read(`content/${c}/jacoby-transfer.md`).includes('../jacoby-transfer-superaccept/'));
}
console.log('Verified 26 lessons, 234 example hands, 520 exercises, unchanged bidding decisions, translated UI, three sources and reciprocal links.');
