import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { legalCalls, contractRank, handCards, shuffled, biddingGridTarget } from '../site/assets/convention-exercises.js';
const data = JSON.parse(await readFile('content/exercises/multi-landy.el.json', 'utf8'));
const questions = data.questions;
assert.equal(questions.length, 20);
assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
const points = { A: 4, K: 3, Q: 2, J: 1 };
for (const role of ['overcall', 'response']) {
  const group = questions.filter(q => q.role === role);
  assert.equal(group.length, 10);
  assert.equal(group.filter(q => q.kind === 'convention').length, 8);
  assert.equal(group.filter(q => q.kind === 'contrast').length, 2);
  const mixed = shuffled(group, () => .31);
  assert.deepEqual(mixed.map(q => q.id).sort(), group.map(q => q.id).sort());
}
for (const q of questions) {
  assert.deepEqual(Object.keys(q.hand).sort(), ['C','D','H','S']);
  const cards = handCards(q.hand);
  assert.equal(cards.length, 13, q.id);
  assert.equal(new Set(cards.map(c => c.suit + c.rank)).size, 13, q.id);
  for (const suit of Object.values(q.hand)) {
    assert.match(suit, /^[AKQJT98765432]+$/);
    const order = [...suit].map(rank => 'AKQJT98765432'.indexOf(rank));
    assert.deepEqual(order, [...order].sort((a,b)=>a-b), q.id + ': rank order');
  }
  assert.ok(legalCalls(q.auction).includes(q.answer), q.id + ': illegal answer');
  assert.equal(q.vulnerability, 'None');
  assert.ok(q.explanation.length > 70);
  const length = suit => q.hand[suit].length;
  if (q.role === 'overcall') {
    let expected = 'PASS';
    if (q.ntRange === '12–14') {
      assert.equal(cards.reduce((sum,c)=>sum+(points[c.rank]||0),0),19);
      expected = 'X';
    } else if (length('C') >= 5 && length('D') >= 5) expected = '2NT';
    else if (Math.max(length('S'),length('H')) >= 5 && Math.min(length('S'),length('H')) >= 4) expected = '2C';
    else if (length('H') >= 5 && Math.max(length('C'),length('D')) >= 5) expected = '2H';
    else if (length('S') >= 5 && Math.max(length('C'),length('D')) >= 5) expected = '2S';
    else if (Math.max(...Object.values(q.hand).map(s=>s.length)) >= 6) expected = '2D';
    assert.equal(q.answer, expected, q.id + ': does not match taught distribution');
  } else {
    assert.equal(q.auction[0].seat, 'W'); assert.equal(q.auction[1].seat, 'N'); assert.equal(q.auction[2].call, 'PASS');
    const partner = q.auction[1].call;
    const expected = partner === '2C' ? length('S') === length('H') ? '2D' : length('S') > length('H') ? '2S' : '2H'
      : partner === '2D' ? '2H' : partner === '2H' ? '2NT' : partner === '2NT' ? '3D' : 'PASS';
    assert.equal(q.answer, expected, q.id + ': response inconsistent with lesson');
    if (partner === '2H') { assert.ok(length('H') <= 2); assert.ok(length('C') >= 3 && length('D') >= 3); }
    if (partner === '2S') assert.ok(length('S') >= 3);
    if (partner === '2NT') assert.ok(length('D') > length('C'));
    if (partner === '3C' || partner === '3D') assert.equal(q.kind, 'contrast');
  }
}
// Legal bidding must follow the auction, independently of the expected exercise answer.
assert.equal(contractRank('1NT'),4); assert.equal(contractRank('2C'),5); assert.equal(contractRank('7NT'),34);
assert.deepEqual(legalCalls([{seat:'E',call:'7NT'}]), ['PASS','X']);
assert.deepEqual(legalCalls([{seat:'N',call:'7NT'},{seat:'E',call:'X'}]), ['PASS','XX']);
assert.ok(!legalCalls([{seat:'W',call:'1NT'},{seat:'N',call:'X'},{seat:'E',call:'PASS'}]).includes('XX'));
assert.ok(!legalCalls([{seat:'W',call:'1NT'},{seat:'N',call:'2C'},{seat:'E',call:'PASS'}]).includes('X'));
assert.equal(biddingGridTarget(5,'ArrowLeft',4),null);
assert.equal(biddingGridTarget(5,'ArrowDown',4),10);
assert.equal(biddingGridTarget(10,'Home',4,true),5);
assert.equal(biddingGridTarget(34,'ArrowRight',4),null);
const html = await readFile('site/el/multi-landy/practice/index.html','utf8');
assert.ok(html.includes('<html lang="el">'));
assert.ok(html.includes('<meta name="robots" content="noindex">'));
assert.ok(html.includes('href="../"'));
assert.ok(html.includes('aria-live="polite"'));
assert.ok(html.includes('const m=location.pathname.match'));
assert.ok((await readFile('site/el/multi-landy/index.html','utf8')).includes('href="practice/"'));
for (const asset of ['convention-exercises.js','convention-exercises.css']) await access('site/assets/' + asset);
console.log('Verified 20 exercise hands, 80/20 in each role, taught meanings, legal bids, keyboard navigation and standalone preview.');

// Validate new convention sets against their lesson's suit meanings.
for (const slug of ['michaels-cue-bid', 'unusual-2nt', 'dont']) {
  const data = JSON.parse(await readFile(`content/exercises/${slug}.el.json`, 'utf8'));
  assert.equal(data.questions.length,20,slug);
  assert.equal(new Set(data.questions.map(q=>q.id)).size,20);
  for (const role of ['overcall','response']) {
    const group=data.questions.filter(q=>q.role===role);
    assert.equal(group.length,10); assert.equal(group.filter(q=>q.kind==='convention').length,8);
    assert.equal(group.filter(q=>q.kind==='contrast').length,2);
  }
  for (const q of data.questions) {
    const label=slug+':'+q.id;
    const cards=handCards(q.hand);
    assert.equal(cards.length,13,label);
    assert.equal(new Set(cards.map(c=>c.suit+c.rank)).size,13,label);
    for (const suit of Object.values(q.hand)) {
      assert.match(suit,/^[AKQJT98765432]+$/);
      const order=[...suit].map(r=>'AKQJT98765432'.indexOf(r));
      assert.deepEqual(order,[...order].sort((a,b)=>a-b),label);
    }
    assert.ok(legalCalls(q.auction).includes(q.answer),label);
    assert.ok(q.explanation.length>70,label);
    assert.equal(q.vulnerability,'None');
    const len=s=>q.hand[s].length;
    const opening=q.auction[0].call;
    assert.equal(q.auction[0].seat,q.role==='overcall'?'E':'W');
    if (q.role==='response') {
      assert.deepEqual(q.auction.map(a=>a.seat),['W','N','E']);
      assert.equal(q.auction[2].call,'PASS');
      assert.ok(legalCalls([q.auction[0]],'N').includes(q.auction[1].call));
    }
    if (q.kind==='contrast') {assert.equal(q.answer,'PASS',label); continue;}
    const michaelsSuits=['1C','1D'].includes(opening)?['H','S']:opening==='1H'?['S']:['H'];
    const unusualSuits={ '1C':['D','H'],'1D':['C','H'],'1H':['C','D'],'1S':['C','D']}[opening];
    if(q.role==='overcall') {
      if(slug==='michaels-cue-bid') {
        assert.equal(q.answer,'2'+opening.slice(1),label);
        assert.ok(michaelsSuits.every(s=>len(s)>=5),label);
        if(michaelsSuits.length===1) assert.ok(Math.max(len('C'),len('D'))>=5,label);
      } else if(slug==='unusual-2nt') {
        assert.equal(q.answer,'2NT');assert.ok(unusualSuits.every(s=>len(s)>=5),label);
      } else {
        assert.equal(opening,'1NT');
        const pairs={ '2C':[['C','D'],['C','H'],['C','S']], '2D':[['D','H'],['D','S']], '2H':[['H','S']]};
        if(q.answer==='X'||q.answer==='2S') assert.ok(Math.max(...Object.values(q.hand).map(s=>s.length))>=6,label);
        else assert.ok(pairs[q.answer].some(([a,b])=>Math.min(len(a),len(b))>=4&&Math.max(len(a),len(b))>=5),label);
      }
    } else if(slug==='michaels-cue-bid') {
      if(michaelsSuits.length===2) assert.equal(q.answer,len('S')>len('H')?'2S':'2H',label);
      else if(q.answer==='2NT') {assert.ok(len(michaelsSuits[0])<=1);assert.ok(len('C')>=4&&len('D')>=4);}
      else assert.equal(q.answer,(michaelsSuits[0]==='H'?'3H':'2S'),label);
    } else if(slug==='unusual-2nt') {
      const [a,b]=unusualSuits;assert.notEqual(len(a),len(b),label);
      assert.equal(q.answer,'3'+(len(a)>len(b)?a:b),label);
    } else {
      const partner=q.auction[1].call;
      if(partner==='X')assert.equal(q.answer,'2C');
      if(partner==='2C')assert.equal(q.answer,len('C')>=3?'PASS':'2D');
      if(partner==='2D')assert.equal(q.answer,len('D')>=3?'PASS':'2H');
      if(partner==='2H')assert.equal(q.answer,len('H')>len('S')?'PASS':'2S');
    }
  }
  const html=await readFile(`site/el/${slug}/practice/index.html`,'utf8');
  assert.ok(html.includes('<h1>'+data.title+'</h1>'));
  assert.ok(html.includes('<meta name="robots" content="noindex">'));
  assert.ok(html.includes('aria-live="polite"'));
  assert.ok((await readFile(`site/el/${slug}/index.html`,'utf8')).includes('href="practice/"'));
  assert.deepEqual(JSON.parse(html.match(/id="exercise-data">([\s\S]*?)<\/script>/)[1]),data);
}
console.log('Verified all 80 exercises: hands, 80/20 per role, convention-specific meanings, legal auctions and generated pages.');
