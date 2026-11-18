import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {legalCalls, handCards, auctionRows} from '../site/assets/convention-exercises.js';
const seen = new Set();
const points = {A:4,K:3,Q:2,J:1};
const sets = ['drury','drury-two-way'];
for (const slug of sets) {
  const d = JSON.parse(await readFile(`content/exercises/${slug}.el.json`,'utf8'));
  const two = slug === 'drury-two-way';
  assert.equal(d.questions.length,20);
  assert.equal(new Set(d.questions.map(q=>q.id)).size,20);
  assert.equal(d.variant,two?'two-way':'reverse');
  assert.equal(d.route,two?'el/two-way-drury/practice/':'el/drury/practice/');
  assert.ok(d.ui.agreements.includes(two?'ακριβώς 3φυλλη':'τουλάχιστον 3φυλλη'));
  assert.ok(d.ui.agreements.includes('Δεν παίζουμε Bergen'));
  for(const role of ['overcall','response']) {
    const group=d.questions.filter(q=>q.role===role);
    assert.equal(group.length,10);
    assert.equal(group.filter(q=>q.kind==='contrast').length,role==='overcall'?2:0);
    assert.ok(group.some(q=>q.openingSeat===3) && group.some(q=>q.openingSeat===4));
    assert.ok(group.some(q=>q.major==='S') && group.some(q=>q.major==='H'));
  }
  for(const q of d.questions) {
    const cards=handCards(q.hand);
    assert.equal(cards.length,13,q.id);
    assert.equal(new Set(cards.map(c=>c.suit+c.rank)).size,13,q.id);
    const key=JSON.stringify(q.hand);
    assert.ok(!seen.has(key),q.id+': use a distinct hand');seen.add(key);
    for(const s of Object.values(q.hand)) {
      assert.match(s,/^[AKQJT98765432]*$/);
      assert.deepEqual([...s],[...s].sort((a,b)=>'AKQJT98765432'.indexOf(a)-'AKQJT98765432'.indexOf(b)));
    }
    const hcp=cards.reduce((n,c)=>n+(points[c.rank]||0),0);
    assert.ok(q.explanation.includes(hcp+' πόντους ονέρ'),q.id+': actual HCP');
    assert.equal(q.vulnerability,'None');
    assert.ok(!/Drury|φυλλ|πόντ|προτασιακ|μανς/.test(q.situation),q.id+': neutral prompt');
    const order='WNES';let next=q.auction[0].seat;
    const history=[];let passes=0;let firstBid;
    for(const entry of q.auction) {
      assert.equal(entry.seat,next,q.id+': turn order');
      assert.ok(legalCalls(history,entry.seat).includes(entry.call),q.id+': legal previous call');
      assert.ok(!['X','XX'].includes(entry.call));
      if(entry.call==='PASS')passes++;else {passes=0;if(!firstBid)firstBid={...entry,index:history.length};}
      assert.ok(passes < (firstBid?3:4),q.id+': auction has not ended');
      history.push(entry);next=order[(order.indexOf(next)+1)%4];
    }
    assert.equal(next,'S');assert.ok(legalCalls(history).includes(q.answer));
    assert.equal(firstBid.index,q.openingSeat-1,q.id+': actual opening position');
    assert.equal(firstBid.call,'1'+q.major);
    assert.deepEqual(auctionRows(history).flat().filter(x=>x&&x.call!=='?'),history);
    if(q.role==='overcall') {
      assert.equal(firstBid.seat,'N');
      assert.ok(history.slice(0,firstBid.index).some(x=>x.seat==='S'&&x.call==='PASS'));
      assert.equal(history.length,q.openingSeat+1);
      const longest=Object.values(q.hand).map(s=>s.length).sort((a,b)=>b-a);
      assert.ok(hcp+longest[0]+longest[1]<20,q.id+': credible passed hand');
      if(q.kind==='contrast') {assert.ok(hcp<=7);assert.equal(q.answer,'2'+q.major);}
      else {
        assert.equal(hcp,11);assert.ok(q.hand[q.major].length>=3);
        assert.equal(q.answer,two&&q.hand[q.major].length>=4?'2D':'2C');
      }
    } else {
      assert.equal(firstBid.seat,'S');
      assert.ok(history.slice(0,firstBid.index).some(x=>x.seat==='N'&&x.call==='PASS'));
      const partner=history.at(-2);
      assert.equal(partner.seat,'N');assert.ok(['2C','2D'].includes(partner.call));
      if(!two)assert.equal(partner.call,'2C');
      assert.equal(history.length,q.openingSeat+3);
      assert.ok(q.hand[q.major].length>=5);
      if(q.openingSeat===4)assert.ok(hcp+q.hand.S.length>=15,q.id+': credible fourth-seat opening');
      if(q.objective==='minimum') {assert.ok(hcp<=12);assert.equal(q.answer,'2'+q.major);assert.ok(q.explanation.includes('για πάσο'));}
      else if(q.objective==='game') {assert.ok(hcp>=16);assert.equal(q.hand[q.major].length,6);assert.equal(q.answer,'4'+q.major);}
      else {assert.equal(q.objective,'enquiry');assert.equal(hcp,13);assert.equal(partner.call,'2C');assert.equal(q.answer,'2D');}
    }
  }
  const html=await readFile('site/'+d.route+'index.html','utf8');
  assert.deepEqual(JSON.parse(html.match(/id="exercise-data">([\s\S]*?)<\/script>/)[1]),d);
  assert.ok(html.includes('<h1>'+d.title+'</h1>'));
  assert.equal((html.match(new RegExp('href="'+d.lessonHref.replaceAll('.','\\.')+'"','g'))||[]).length,3);
  for(const href of [...html.matchAll(/<a[^>]+href="([^"]+)"/g)].map(x=>x[1]).filter(x=>!x.startsWith('#'))) {
    assert.equal(new URL(href,'https://leonardobridge.com/'+d.route).pathname,two?'/el/two-way-drury/':'/el/drury/');
  }
  assert.ok(html.includes('Σωστές: 0/0') && html.includes('Άσκηση: 1/10'));
}
assert.equal(seen.size,40);
for(const slug of ['drury','two-way-drury']) {
  const lesson=await readFile('site/el/'+slug+'/index.html','utf8');
  assert.ok(lesson.includes('href="practice/"'));
  assert.ok(!lesson.includes('two-way/practice/'));
}
console.log('Verified 40 unchanged Drury exercises: 10 per role and version, standard routes and separate lesson returns.');

const languages=JSON.parse(await readFile('content/i18n/languages.json','utf8'));
const pattern=/♠ ([AKQJT2-9]+)  \n♥ ([AKQJT2-9]+)  \n♦ ([AKQJT2-9]+)  \n♣ ([AKQJT2-9]+)/g;
const hands=text=>[...text.matchAll(pattern)].map(m=>m.slice(1));
for(const [index,slug] of ['drury','two-way-drury'].entries()) {
 const title=index?'Two-way Drury':'Reverse Drury';
 const other=index?'drury':'two-way-drury';
 const reference=await readFile('content/el/'+slug+'.md','utf8');
 for(const language of languages) {
  const code=language.code;
  const source=await readFile('content/'+code+'/'+slug+'.md','utf8');
  const html=await readFile('site/'+code+'/'+slug+'/index.html','utf8');
  assert.deepEqual(hands(source),hands(reference),code+'/'+slug+': same examples');
  assert.equal(hands(source).length,6);
  assert.equal((source.match(/^## /gm)||[]).length,6);
  assert.equal((source.match(/^### /gm)||[]).length,index?7:8);
  assert.equal((source.match(/^\| ---/gm)||[]).length,2);
  assert.equal((html.match(/class="example-row"/g)||[]).length,6);
  assert.equal((html.match(/hreflang=/g)||[]).length,26);
  assert.ok(html.includes('<h1 dir="ltr">'+title+'</h1>'));
  assert.ok(html.includes('href="../'+other+'/"'));
  assert.ok(!html.includes('**'));
  assert.ok(!html.includes('two-way/practice/'));
  const catalog=await readFile('site/'+code+'/conventions/index.html','utf8');
  assert.ok(catalog.includes('<strong dir="ltr">'+title+'</strong>'));
  assert.ok(catalog.includes(language.cards[7+index]));
  assert.ok([...language.cards[7+index]].length<=100);
  if(code!=='el')assert.ok(!html.includes('practice/'));
 }
}
console.log('Verified two standalone Drury articles in all 26 languages: six sections, six paired examples each, reciprocal same-language links, separate catalog entries and standard practice routes.');
