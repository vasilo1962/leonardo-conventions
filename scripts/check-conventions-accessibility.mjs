import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
const languages=JSON.parse(await readFile('content/i18n/languages.json','utf8'));
const copies=JSON.parse(await readFile('content/shared/accessibility.json','utf8'));
const slugs=['multi-landy','michaels-cue-bid','unusual-2nt','dont'];
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const lang of languages){
 const copy=copies[lang.code];assert.ok(copy);
 for(const field of ['message','close','disable','settings','reader','mode','hint'])assert.ok(copy[field]?.length,lang.code+field);
 for(const route of [lang.code+'/',...slugs.map(s=>lang.code+'/'+s+'/')]){
  const html=await readFile('site/'+route+'index.html','utf8');
  assert.equal((html.match(/class="site-header"/g)||[]).length,1);
  assert.equal((html.match(/class="voice-intro"/g)||[]).length,1);
  assert.ok(html.includes(escape(copy.reader)));
  assert.ok(html.includes(escape(copy.message)));
  assert.ok(html.includes('conventions-accessibility.js'));
  const data=JSON.parse(html.match(/id="voice-copy">([\s\S]*?)<\/script>/)[1]);assert.deepEqual(data,copy);
 }
}
for(const s of slugs){const html=await readFile('site/el/'+s+'/practice/index.html','utf8');assert.ok(html.includes('id="voice-reader"'));assert.ok(html.includes('conventions-accessibility.js'));}
for(const asset of ['conventions-accessibility.css','conventions-accessibility.js','leonardo-wordmark.svg'])await access('site/assets/'+asset);
console.log('Verified shared accessible header, one native introduction dialog and complete controls/messages for all 26 languages and four exercise sets.');
