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
