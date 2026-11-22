import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {legalCalls, handCards, auctionRows} from '../site/assets/convention-exercises.js';

const data = JSON.parse(await readFile('content/exercises/bergen-raises.el.json', 'utf8'));
const points = {A:4, K:3, Q:2, J:1};
const hcp = hand => handCards(hand).reduce((sum, card) => sum + (points[card.rank] || 0), 0);
assert.equal(data.questions.length, 20);
assert.equal(new Set(data.questions.map(q => q.id)).size, 20);
for (const role of ['overcall','response']) assert.equal(data.questions.filter(q => q.role === role).length, 10);
assert.equal(data.questions.filter(q => q.kind === 'contrast').length, 3);
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
  const major = q.auction[0].call.slice(1);
  assert.ok(['H','S'].includes(major));
  if(q.role === 'overcall') {
    assert.deepEqual(q.auction.map(entry=>entry.seat),['N','E']);
    if(q.kind === 'contrast') {
      if(q.answer === '2NT') {
        assert.equal(strength,16);
        assert.equal(q.hand[major].length,4);
        assert.equal(Object.values(q.hand).map(cards=>cards.length).sort().join(''),'3334');
        assert.ok(!/Jacoby|forcing|μανς|2NT|2ΝΤ/.test(q.situation));
        assert.ok(q.explanation.includes('Jacoby'));
      } else {
        assert.equal(q.hand[major].length,3);
        assert.ok(strength>=6 && strength<=9);
        assert.equal(q.answer,'2'+major);
      }
    } else {
      assert.ok(q.hand[major].length>=4);
      if(q.answer==='3C') assert.ok(strength>=7 && strength<=9);
      else if(q.answer==='3D') assert.ok(strength>=10 && strength<=12);
      else { assert.equal(q.answer,'3'+major); assert.ok(strength<=6); }
    }
  } else {
    assert.deepEqual(q.auction.map(entry=>entry.seat),['S','W','N','E']);
    assert.ok(q.hand[major].length>=5);
    assert.ok(['3C','3D'].includes(q.auction[2].call));
    assert.equal(Object.values(q.hand).map(cards=>cards.length).sort().join(''),'2335');
    if(q.answer==='3D') {
      assert.equal(q.auction[2].call,'3C');
      assert.equal(strength,16);
    } else if(q.answer==='3'+major) {
      assert.ok(strength>=12 && strength<=13);
    } else {
      assert.equal(q.answer,'4'+major);
      assert.ok(strength >= (q.auction[2].call==='3C'?18:16));
    }
  }
}
const exercise = await readFile('site/el/bergen-raises/practice/index.html','utf8');
assert.deepEqual(JSON.parse(exercise.match(/id="exercise-data">([\s\S]*?)<\/script>/)[1]),data);
assert.ok(exercise.includes('Απαντώ στο άνοιγμα') && exercise.includes('Συνεχίζω ως ανοίξας'));
assert.ok(!exercise.includes('Κάνω παρεμβολή'));
assert.ok((await readFile('site/el/bergen-raises/index.html','utf8')).includes('href="practice/"'));
for(const answer of ['3C','3D','3H','3S','2H','2S','2NT']) assert.ok(data.questions.some(q=>q.role==='overcall' && q.answer===answer));
for(const answer of ['3H','3S','4H','4S','3D']) assert.ok(data.questions.some(q=>q.role==='response' && q.answer===answer));
assert.ok(data.questions.filter(q=>q.role==='response').every(q=>q.kind==='convention'));
assert.equal(data.questions.filter(q=>q.answer==='2NT').length,1);
assert.ok(data.ui.agreements.includes('Jacoby 2NT'));
assert.ok(exercise.match(/<p class="exercise-intro">([\s\S]*?)<\/p>/)[1].replace(/<span class="sr-only">[\s\S]*?<\/span>/g,'').replace(/<[^>]+>/g,'').includes(data.ui.agreements));
console.log('Verified Bergen Raises: 20 hands, 10 per role, 7 Bergen responses, 2 simple raises, 1 clear Jacoby game force with neutral question and common agreement, HCP, fit, legal auctions, minimum/maximum game tries, accepted/declined invitations and embedded exercise data.');
