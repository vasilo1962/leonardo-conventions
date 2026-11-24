import fs from 'node:fs';
import assert from 'node:assert/strict';
import {articles} from './articles.mjs';
const read=p=>fs.readFileSync(p,'utf8'),write=(p,s)=>fs.writeFileSync(p,s);
const packs=JSON.parse(read('content/i18n/jacoby-superaccept.json'));
const greek=JSON.parse(read('content/exercises/jacoby-superaccept.el.json'));
const hands=read('content/el/jacoby-transfer-superaccept.md').match(/^♠ .+\n♥ .+\n♦ .+\n♣ .+$/gm);assert.equal(hands.length,9);
const base=articles.find(a=>a.slug==='jacoby-transfer');
const nt={fr:'SA',de:'SA',it:'SA',es:'ST',pt:'ST',nl:'SA',da:'UT',pl:'BA',cs:'BT',is:'G',ru:'БК'};
const descriptions=JSON.parse(read('content/i18n/article-descriptions.json'));
const exerciseUi={},titles={};
for(const [code,t] of Object.entries(packs)){
 const loc=s=>s.replace(/([1-7])NT/g,`$1${nt[code]||'NT'}`);
 const old=JSON.parse(read(`content/exercises/jacoby-transfer.${code}.json`));
 const source=read(`content/${code}/jacoby-transfer.md`);
 const heads=[...source.matchAll(/^## (.+)$/gm)].map(m=>m[1]); assert.equal(heads.length,6);
 const p=t.p.map(loc),ui=t.ui.map(loc),w=t.w.map(loc);
 const intro=p[0].replace('Jacoby Transfer','[Jacoby Transfer](../jacoby-transfer/)');
 let md=`# ${ui[0]}\n\n${intro}\n\n## ${heads[0]}\n\n${p[1]}\n\n## ${heads[1]}\n\n${p[2]}\n\n${p[3]}\n\n## ${ui[7]}\n\n${p[4]}\n\n`;
 md+=`| ${w[0]} | ${w[1]} 1${nt[code]||'NT'} – 2♦ | ${w[1]} 1${nt[code]||'NT'} – 2♥ |\n| --- | --- | --- |\n`;
 for(const [s,h,sp] of [['C','3♣','3♣'],['D',loc('2NT'),'3♦'],['H','—',loc('2NT')],['S','2♠','—']])md+=`| ${w[2]}: ${old.ui.suitNames[s]} | ${h} | ${sp} |\n`;
 md+=`| ${w[3]} | 3♥ | 3♠ |\n\n${p[5]}\n\n${p[6]}\n\n## ${ui[1]}\n\n`;
 for(let i=0;i<5;i++)md+=`### ${i+1}. ${['3♣',loc('2NT'),loc('2NT'),'3♠','2♥'][i]}\n\n${hands[i]}\n\n${p[7+i]}\n\n`;
 md+=`## ${ui[2]}\n\n`;
 for(let i=0;i<4;i++)md+=`${p[12+i*2]}\n\n${hands[5+i]}\n\n${p[13+i*2]}\n\n`;
 md+=`## ${heads[5]}\n\n${p[20]}\n\n### ${ui[8]}\n\n${p[21].replace('**Byron Lund**','**[Byron Lund](https://www.abf.com.au/wp-content/uploads/2026/03/How-to-Play-Expert-Bridge.pdf#page=87)**')}\n\n${p[22].replace('**Robert S. Todd**','**[Robert S. Todd](https://www.advinbridge.com/this-week-in-bridge/518)**').replace('**Larry Cohen**','**[Larry Cohen](https://larryco.com/bridge-articles/control-bidding?p=true)**')}\n`;
 write(`content/${code}/jacoby-transfer-superaccept.md`,md);
 const data=structuredClone(greek);data.title=ui[0];data.language=code;data.route=`${code}/jacoby-transfer-superaccept-practice/`;data.lessonHref='../jacoby-transfer-superaccept/';data.ui=structuredClone(old.ui);
 Object.assign(data.ui,{overcall:ui[1],response:ui[2],overcallQuestion:ui[3],responseQuestion:ui[4],description:ui[5],agreements:ui[6]});
 Object.assign(data.ui.locale,{overcall:ui[1],response:ui[2]});
 for(const q of data.questions){
  let index;
  if(q.role==='overcall')index=q.objective==='flat'?2:q.objective==='nonmaximum'?3:q.objective==='three-trumps'?4:q.answer==='2NT'?1:0;
  else index={'partscore-retransfer':5,'partscore-flat':6,'game-retransfer':7,'game-flat':8,'slam-control':q.major==='H'?9:10,'slam-keycards':11}[q.objective];
  const vals={hcp:Object.values(q.hand).join('').split('').reduce((s,r)=>s+({A:4,K:3,Q:2,J:1}[r]||0),0),major:old.ui.suitNames[q.major],short:old.ui.suitNames[Object.keys(q.hand).find(s=>q.hand[s].length===2)]||'',answer:q.answer==='PASS'?old.ui.locale.pass:loc(q.answer.replace(/([1-7])([SHDC])/g,(_,n,s)=>n+{S:'♠',H:'♥',D:'♦',C:'♣'}[s]))};
  q.situation=ui[q.role==='overcall'?3:4];q.explanation=loc(t.e[index].replace(/\{(\w+)\}/g,(_,k)=>vals[k]));
 }
 write(`content/exercises/jacoby-superaccept.${code}.json`,JSON.stringify(data,null,2)+'\n');
 titles[code]=ui[0];exerciseUi[code]={title:`${old.ui.locale.exercises} · ${ui[0]}`,text:ui[5],button:base.exerciseUi[code].button,href:'../jacoby-transfer-superaccept-practice/'};
 // Retain the basic acceptance rule; replace the parenthetic future-lesson reference with the available lesson.
 const tail=source.lastIndexOf('\n## '),before=source.slice(0,tail),lines=source.slice(tail).split('\n');
 const bullets=lines.map((l,i)=>l.startsWith('- ')?i:-1).filter(i=>i>=0);
 assert.equal(bullets.length,4,code);const k=bullets[1],line=lines[k];let at=line.search(/[（(]/);if(at<0)at=line.indexOf(' [');assert.ok(at>0,code+': lesson reference');
 if(!line.includes('../jacoby-transfer-superaccept/'))lines[k]=line.slice(0,at).trimEnd()+` [${ui[0]}](../jacoby-transfer-superaccept/).`;
 write(`content/${code}/jacoby-transfer.md`,before+lines.join('\n'));
 descriptions['jacoby-transfer-superaccept'][code]=t.meta||ui[5];
}
write('content/i18n/article-descriptions.json',JSON.stringify(descriptions,null,2)+'\n');
const a=articles.find(a=>a.slug==='jacoby-transfer-superaccept');delete a.languages;Object.assign(a,{titles,exerciseLanguages:['el',...Object.keys(packs)],exerciseUi});
let config=read('scripts/articles.mjs');config=config.replace(/^  \{ slug: 'jacoby-transfer-superaccept'.*$/m,'  '+JSON.stringify(a)+',');write('scripts/articles.mjs',config);
