import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {legalCalls, handCards, auctionRows} from '../site/assets/convention-exercises.js';

const data = JSON.parse(await readFile('content/exercises/inverted-minors.el.json', 'utf8'));
const points = {A:4, K:3, Q:2, J:1};
const hcp = hand => handCards(hand).reduce((sum, card) => sum + (points[card.rank] || 0), 0);
const stopped = cards => cards.includes('A') || (cards.includes('K') && cards.length >= 2)
  || (cards.includes('Q') && cards.length >= 3) || (cards.includes('J') && cards.length >= 4);
assert.equal(data.questions.length, 20);
assert.equal(new Set(data.questions.map(q => q.id)).size, 20);
for (const role of ['overcall','response']) assert.equal(data.questions.filter(q => q.role === role).length, 10);
assert.equal(data.questions.filter(q => q.kind === 'contrast').length, 2);
for (const q of data.questions) {
  const cards = handCards(q.hand);
  assert.equal(cards.length, 13, q.id);
  assert.equal(new Set(cards.map(card => card.suit + card.rank)).size, 13, q.id);
  for (const suit of Object.values(q.hand)) {
    assert.match(suit, /^[AKQJT98765432]+$/);
    const order = [...suit].map(rank => 'AKQJT98765432'.indexOf(rank));
    assert.deepEqual(order, [...order].sort((a,b)=>a-b), q.id);
  }
  let expectedSeat = q.auction[0].seat;
  const previous = [];
  for (const entry of q.auction) {
    assert.equal(entry.seat, expectedSeat, q.id + ': turn order');
    assert.ok(legalCalls(previous, entry.seat).includes(entry.call), q.id + ': legal history');
    previous.push(entry);
    expectedSeat = 'WNES'[('WNES'.indexOf(expectedSeat)+1)%4];
  }
  assert.equal(expectedSeat, 'S');
  assert.ok(legalCalls(q.auction).includes(q.answer), q.id + ': legal answer');
  assert.equal(q.vulnerability, 'None');
  assert.ok(q.situation && !q.situation.includes('παρεμβάλλεται'));
  assert.ok(q.explanation.length > 70);
  const strength = hcp(q.hand);
  assert.ok(q.explanation.includes(strength + ' πόντ'), q.id + ': stated HCP');
  const rows = auctionRows(q.auction);
  assert.deepEqual(rows.flat().filter(entry => entry && entry.call !== '?'), q.auction, q.id + ': displayed history');
  assert.equal(rows.flat().filter(entry => entry?.call === '?').length, 1);
  const suit = q.auction[0].call.slice(1);
  if (q.role === 'overcall') {
    assert.deepEqual(q.auction.map(entry=>entry.seat), ['N','E']);
    if(q.kind === 'contrast') {
      assert.ok(q.hand[q.answer.slice(1)].length >= 4);
      assert.ok(['1H','1S'].includes(q.answer));
    } else {
      assert.ok(q.hand.S.length < 4 && q.hand.H.length < 4);
      assert.ok(q.hand[suit].length >= 5);
      if(q.answer[0] === '2') assert.ok(strength >= 10);
      else assert.ok(q.answer[0] === '3' && strength >= 6 && strength <= 9);
      assert.equal(q.answer.slice(1), suit);
    }
  } else {
    assert.deepEqual(q.auction.map(entry=>entry.seat), ['S','W','N','E']);
    assert.equal(q.auction[2].call, '2'+suit);
    assert.ok(strength >= 12);
    if (q.answer.endsWith('NT')) {
      assert.deepEqual(Object.values(q.hand).map(cards=>cards.length).sort().join(''),
        q.hand[suit].length === 5 ? '2335' : '3334');
      assert.ok(stopped(q.hand.S) && stopped(q.hand.H));
      if(q.answer === '2NT') assert.ok(strength <= 14);
      else {
        assert.ok(strength >= 18 && strength <= 19);
        assert.ok(stopped(q.hand[suit === 'C' ? 'D' : 'C']));
      }
    } else if(q.answer[0] === '2') {
      assert.ok(stopped(q.hand[q.answer.slice(1)]));
      assert.ok(!(stopped(q.hand.S) && stopped(q.hand.H)), q.id + ': use minimum NT with both majors stopped');
    } else {
      assert.equal(q.answer, '3'+suit);
      assert.ok(strength <= 14 && q.hand[suit].length >= 6);
      assert.ok(['S','H','D','C'].filter(s=>s!==suit).every(s=>!stopped(q.hand[s])));
    }
  }
}
const lesson = await readFile('site/el/inverted-minors/index.html','utf8');
assert.equal((lesson.match(/class="hand"/g)||[]).length,7);
assert.equal((lesson.match(/hreflang=/g)||[]).length,26);
assert.ok(!lesson.includes('undefined'));
const exercise = await readFile('site/el/inverted-minors/practice/index.html','utf8');
assert.ok(exercise.includes('Συνεχίζω ως ανοίξας'));
assert.ok(!exercise.includes('Κάνω παρεμβολή'));
assert.deepEqual(JSON.parse(exercise.match(/id="exercise-data">([\s\S]*?)<\/script>/)[1]), data);
const languages = JSON.parse(await readFile('content/i18n/languages.json','utf8'));
for (const language of languages) {
  const catalog = await readFile(`site/${language.code}/conventions/index.html`,'utf8');
  assert.equal(catalog.includes('/inverted-minors/'), true);
}
console.log('Verified Inverted Minors: 20 hands, HCP, support, major priority, stopper agreements, complete legal multi-round auctions and links in all 26 languages.');
