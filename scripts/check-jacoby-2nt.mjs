import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { legalCalls, handCards, auctionRows } from '../site/assets/convention-exercises.js';

const data = JSON.parse(await readFile('content/exercises/jacoby-2nt.el.json', 'utf8'));
const points = { A: 4, K: 3, Q: 2, J: 1 };
assert.equal(data.questions.length, 20);
assert.equal(new Set(data.questions.map(q => q.id)).size, 20);
for (const role of ['overcall', 'response']) assert.equal(data.questions.filter(q => q.role === role).length, 10);
assert.equal(data.questions.filter(q => q.kind === 'contrast').length, 2);
for (const q of data.questions) {
  const cards = handCards(q.hand);
  assert.equal(cards.length, 13, q.id);
  assert.equal(new Set(cards.map(c => c.suit + c.rank)).size, 13, q.id);
  for (const suit of Object.values(q.hand)) {
    assert.match(suit, /^[AKQJT98765432]*$/);
    const order = [...suit].map(r => 'AKQJT98765432'.indexOf(r));
    assert.deepEqual(order, [...order].sort((a,b) => a-b), q.id);
  }
  const strength = cards.reduce((sum, c) => sum + (points[c.rank] || 0), 0);
  assert.ok(q.explanation.includes(strength + ' πόντ'), q.id + ': stated HCP');
  let seat = q.auction[0].seat;
  const history = [];
  for (const bid of q.auction) {
    assert.equal(bid.seat, seat, q.id + ': turn order');
    assert.ok(legalCalls(history, seat).includes(bid.call), q.id + ': legal history');
    history.push(bid);
    seat = 'WNES'[('WNES'.indexOf(seat) + 1) % 4];
  }
  assert.equal(seat, 'S');
  assert.ok(legalCalls(history).includes(q.answer), q.id + ': legal answer');
  assert.deepEqual(auctionRows(history).flat().filter(b => b && b.call !== '?'), history);
  assert.equal(q.vulnerability, 'None');
  const major = q.auction[0].call.slice(1);
  assert.ok(['H', 'S'].includes(major));
  const len = suit => q.hand[suit].length;
  if (q.role === 'overcall') {
    assert.deepEqual(q.auction.map(b => b.seat), ['N','E']);
    assert.ok(!/Jacoby|forcing|2NT|μανς|πόντ|φυλλ/.test(q.situation), q.id + ': neutral prompt');
    if (q.kind === 'contrast') {
      assert.equal(len(major), 3);
      assert.ok(strength >= 6 && strength <= 9);
      assert.equal(q.answer, '2' + major);
    } else {
      assert.ok(len(major) >= 4 && strength >= 15, q.id + ': unambiguous game force');
      assert.ok(Object.values(q.hand).every(s => s.length >= 2), q.id + ': no competing splinter');
      assert.equal(q.answer, '2NT');
    }
  } else {
    assert.deepEqual(q.auction.map(b => b.seat), ['S','W','N','E']);
    assert.equal(q.auction[2].call, '2NT');
    assert.ok(len(major) >= 5);
    const short = ['S','H','D','C'].filter(s => s !== major && len(s) <= 1);
    if (q.objective === 'shortness') {
      assert.equal(short.length, 1);
      assert.equal(q.answer, '3' + short[0]);
      assert.ok(!['S','H','D','C'].some(s => s !== major && len(s) >= 5));
    } else if (q.objective === 'side-suit') {
      const suit = q.answer.slice(1);
      assert.equal(q.answer[0], '4');
      assert.notEqual(suit, major);
      assert.ok(len(suit) >= 5 && q.hand[suit].startsWith('KQJ'));
    } else {
      assert.equal(short.length, 0);
      if (q.objective === 'minimum') { assert.ok(strength <= 14); assert.equal(q.answer, '4' + major); }
      else if (q.objective === 'medium') { assert.ok(strength >= 15 && strength <= 17); assert.equal(q.answer, '3NT'); }
      else { assert.equal(q.objective, 'strong'); assert.ok(strength >= 18); assert.equal(q.answer, '3' + major); }
    }
  }
}
assert.ok(data.questions.some(q => Object.values(q.hand).some(s => s.length === 0)), 'Void example');
const html = await readFile('site/el/jacoby-2nt/practice/index.html', 'utf8');
assert.deepEqual(JSON.parse(html.match(/id="exercise-data">([\s\S]*?)<\/script>/)[1]), data);
assert.ok(html.includes('Απαντώ στο άνοιγμα') && html.includes('Συνεχίζω ως ανοίξας'));
assert.ok((await readFile('site/el/jacoby-2nt/index.html', 'utf8')).includes('href="practice/"'));
console.log('Verified 20 Jacoby exercises: 8 clear game forces, 2 simple raises, all five opener rebids, singleton/void, HCP, 13 distinct cards, complete legal auctions and lesson links.');
