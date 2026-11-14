// Faithful web adaptation of the existing table card and bidding-box presentation.
// The exercise data and feedback are local to this static conventions preview.
const DENOMINATIONS = ['C', 'D', 'H', 'S', 'NT'];
const SYMBOLS = { S: '♠', H: '♥', D: '♦', C: '♣', NT: 'NT' };
const COLORS = { S: '#111111', H: '#c62828', D: '#ff8139', C: '#4f5b62', NT: '#0a3c6a' };
const SUIT_NAMES = { S: 'πίκες', H: 'κούπες', D: 'καρά', C: 'σπαθιά', NT: 'χωρίς ατού' };
const RANK_NAMES = { A: 'άσος', K: 'ρήγας', Q: 'ντάμα', J: 'βαλές', T: 'δέκα' };
const SEATS = ['W', 'N', 'E', 'S'];
const POSITIONS = { W: 'Δύση', N: 'Βορράς', E: 'Ανατολή', S: 'Νότος' };

export function contractRank(call) {
  return /^[1-7](C|D|H|S|NT)$/.test(call)
    ? (Number(call[0]) - 1) * 5 + DENOMINATIONS.indexOf(call.slice(1)) : -1;
}
export function legalCalls(auction, seat = 'S') {
  const contract = [...auction].reverse().find(entry => contractRank(entry.call) >= 0);
  const previous = [...auction].reverse().find(entry => entry.call !== 'PASS');
  const side = value => value === 'N' || value === 'S' ? 'NS' : 'EW';
  const calls = Array.from({ length: 35 }, (_, rank) => `${Math.floor(rank / 5) + 1}${DENOMINATIONS[rank % 5]}`)
    .filter(call => contractRank(call) > (contract ? contractRank(contract.call) : -1));
  calls.push('PASS');
  if (previous && side(previous.seat) !== side(seat)) {
    if (contractRank(previous.call) >= 0) calls.push('X');
    if (previous.call === 'X') calls.push('XX');
  }
  return calls;
}
export function handCards(hand) {
  // Same no-trump order as the game's sortHand: spades, hearts, clubs, diamonds.
  return ['S', 'H', 'C', 'D'].flatMap(suit => [...hand[suit]].map(rank => ({ suit, rank })));
}
export function shuffled(list, random = Math.random) {
  const result = [...list];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}
export function biddingGridTarget(currentRank, key, lastContractRank, wholeGrid = false) {
  if (currentRank < 0 || currentRank >= 35 || currentRank <= lastContractRank) return null;
  const rowStart = Math.floor(currentRank / 5) * 5;
  const target = key === 'ArrowUp' ? currentRank - 5 : key === 'ArrowDown' ? currentRank + 5
    : key === 'ArrowLeft' ? currentRank - 1 : key === 'ArrowRight' ? currentRank + 1
    : key === 'Home' ? wholeGrid ? lastContractRank + 1 : Math.max(rowStart, lastContractRank + 1)
    : key === 'End' ? wholeGrid ? 34 : rowStart + 4 : null;
  return target !== null && target >= 0 && target < 35 && target > lastContractRank ? target : null;
}
export function callLabel(call) {
  return call === 'PASS' ? 'Πάσο' : call === 'X' ? 'Κοντρ' : call === 'XX' ? 'Σιρκόντρ' : call[0] + SYMBOLS[call.slice(1)];
}
function callSpeech(call) {
  return call === 'PASS' ? 'Πάσο' : call === 'X' ? 'Κοντρ' : call === 'XX' ? 'Σιρκόντρ' : call[0] + ' ' + SUIT_NAMES[call.slice(1)];
}
function node(tag, attrs = {}, text = '') {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, value);
  if (text) element.textContent = text;
  return element;
}
function initializeExercises() {
  const source = document.querySelector('#exercise-data');
  if (!source) return;
  const { questions } = JSON.parse(source.textContent);
  const $ = selector => document.querySelector(selector);
  const sessions = {};
  let mode = 'overcall';
  const start = role => ({ questions: shuffled(questions.filter(q => q.role === role)), index: 0, answers: new Map(), finished: false });
  sessions.overcall = start('overcall');
  sessions.response = start('response');
  const current = () => sessions[mode].questions[sessions[mode].index];
  const table = $('.exercise-table');
  const bidding = $('#exercise-bidding');
  const feedback = $('#exercise-feedback');
  const summary = $('#exercise-summary');
  let biddingHidden = false;
  let announceTimer;
  const announce = text => {
    clearTimeout(announceTimer);
    $('#exercise-announcement').textContent = '';
    announceTimer = setTimeout(() => { $('#exercise-announcement').textContent = text; }, 40);
  };
  function geometry() {
    const frameStyle = getComputedStyle(table);
    const width = table.clientWidth - parseFloat(frameStyle.paddingLeft) - parseFloat(frameStyle.paddingRight);
    const mobile = window.innerWidth < 768;
    // Same ratios as card-constants.ts, game-area-layout.ts and use-bridge-auction.tsx.
    const cardWidth = mobile ? width * .99 / 13 : width * .70 / 13;
    const cardHeight = cardWidth * 1.5;
    const boxWidth = mobile ? width * .80 : Math.min(352 * 1.10, width * .60);
    const boxHeight = mobile ? boxWidth * .70 : boxWidth / 1.10;
    const optionHeight = boxHeight / 8;
    const optionWidth = boxWidth / 5;
    const set = (key, value) => table.style.setProperty(key, value + 'px');
    set('--card-w', cardWidth); set('--card-h', cardHeight);
    set('--bid-h', optionHeight);
    set('--bid-font', mobile ? Math.min(optionHeight * .80, optionWidth * .60) : optionHeight * .80);
    set('--nt-font', mobile ? Math.min(optionHeight * .60, optionWidth * .45) : optionHeight * .60);
    set('--bid-radius', Math.min(optionHeight * .24, window.innerHeight * .01));
    set('--grid-border', window.innerHeight * .002); set('--separator', window.innerHeight * .001);
    bidding.style.width = boxWidth + 'px';
    $('.exercise-bidding-area').style.minHeight = boxHeight + 'px';
    $('#toggle-bidding').hidden = !mobile;
    if (!mobile) { bidding.hidden = false; biddingHidden = false; $('#toggle-bidding').setAttribute('aria-expanded', 'true'); }
  }
  function drawHand(question) {
    const list = $('#exercise-hand');
    list.replaceChildren();
    for (const card of handCards(question.hand)) {
      const name = `${SUIT_NAMES[card.suit]}, ${RANK_NAMES[card.rank] || card.rank}`;
      const item = node('div', { class: 'exercise-card', role: 'listitem', tabindex: '0', 'aria-label': name });
      item.style.color = COLORS[card.suit];
      item.append(node('span', { class: 'rank' + (card.rank === 'T' ? ' ten' : ''), 'aria-hidden': 'true' }, card.rank === 'T' ? '10' : card.rank));
      item.append(node('span', { class: 'suit', 'aria-hidden': 'true' }, SYMBOLS[card.suit]));
      list.append(item);
    }
  }
  function drawAuction(question) {
    const auction = node('table', { 'aria-label': 'Η αγορά μέχρι τώρα' });
    const head = node('thead'); const headings = node('tr');
    const row = node('tr');
    for (const seat of SEATS) {
      const heading = node('th', { scope: 'col' }, POSITIONS[seat]);
      heading.append(node('span', {}, seat === 'S' ? 'Εσύ' : seat === 'N' ? 'Συμπαίκτης' : 'Αντίπαλος'));
      headings.append(heading);
      const call = question.auction.find(entry => entry.seat === seat)?.call;
      const td = node('td', { 'aria-label': `${POSITIONS[seat]}: ${seat === 'S' ? 'η σειρά σου' : call ? callSpeech(call) : 'δεν έχει αγοράσει'}` }, seat === 'S' ? '?' : call ? callLabel(call) : '—');
      if (call === 'PASS') td.className = 'auction-pass';
      else if (call && contractRank(call) >= 0) td.style.color = COLORS[call.slice(1)];
      else if (call === 'X') td.style.color = '#c62828';
      else if (seat === 'S') td.className = 'auction-current';
      row.append(td);
    }
    head.append(headings); auction.append(head); const body = node('tbody'); body.append(row); auction.append(body);
    $('#exercise-auction').replaceChildren(auction);
  }
  function select(call) {
    const session = sessions[mode]; const question = current();
    if (session.answers.has(question.id) || !legalCalls(question.auction).includes(call)) return;
    session.answers.set(question.id, call);
    showFeedback(question, call);
    drawBidding(question, call);
    $('.turn-label').textContent = 'Απάντησες';
    announce(`${callSpeech(call)}. ${call === question.answer ? 'Σωστά.' : 'Η σωστή αγορά είναι ' + callSpeech(question.answer) + '.'} ${question.explanation}`);
    $('#next-exercise').focus({ preventScroll: true });
    feedback.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }
  function showFeedback(question, call) {
    feedback.hidden = false;
    const correct = call === question.answer;
    feedback.classList.toggle('correct', correct);
    $('#feedback-title').textContent = correct ? 'Σωστά!' : 'Η σωστή αγορά είναι ' + callLabel(question.answer);
    $('#feedback-answer').textContent = 'Η επιλογή σου: ' + callLabel(call) + '.';
    $('#feedback-explanation').textContent = question.explanation;
    $('#next-exercise').textContent = sessions[mode].index === sessions[mode].questions.length - 1 ? 'Δες το αποτέλεσμα' : 'Επόμενη άσκηση';
  }
  function drawBidding(question, selected = null) {
    const allowed = legalCalls(question.auction);
    const grid = node('div', { class: 'exercise-bid-grid', role: 'group', 'aria-label': 'Αγορές από 1 έως 7' });
    const createButton = call => {
      const button = node('button', { type: 'button', 'data-call': call, 'aria-label': callSpeech(call) });
      button.disabled = selected !== null || !allowed.includes(call);
      if (selected === call) button.classList.add('selected-call');
      if (contractRank(call) >= 0) {
        button.style.color = COLORS[call.slice(1)];
        button.append(document.createTextNode(call[0]));
        button.append(node('span', { class: call.endsWith('NT') ? 'bid-nt' : '', 'aria-hidden': 'true' }, SYMBOLS[call.slice(1)]));
      } else button.textContent = call === 'PASS' ? 'PASS' : call;
      button.addEventListener('click', () => select(call));
      button.addEventListener('keydown', event => {
        if (contractRank(call) < 0) return;
        const last = [...question.auction].reverse().find(entry => contractRank(entry.call) >= 0);
        const target = biddingGridTarget(contractRank(call), event.key, last ? contractRank(last.call) : -1, event.ctrlKey || event.metaKey);
        if (target !== null) {
          event.preventDefault();
          const nextCall = `${Math.floor(target / 5) + 1}${DENOMINATIONS[target % 5]}`;
          bidding.querySelector(`[data-call="${nextCall}"]`)?.focus();
        }
      });
      return button;
    };
    for (let level = 1; level <= 7; level++) for (const suit of DENOMINATIONS) grid.append(createButton(level + suit));
    const actions = node('div', { class: 'exercise-actions', role: 'group', 'aria-label': 'Πάσο, κοντρ και σιρκόντρ' });
    for (const call of ['XX', 'PASS', 'X']) actions.append(createButton(call));
    bidding.replaceChildren(grid, actions);
  }
  function render(focus = false) {
    const session = sessions[mode];
    document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
    summary.hidden = !session.finished; table.hidden = session.finished; feedback.hidden = true;
    if (session.finished) {
      const correct = session.questions.filter(q => session.answers.get(q.id) === q.answer).length;
      $('#summary-score').textContent = `Σωστές απαντήσεις: ${correct} από ${session.questions.length}.`;
      $('#exercise-progress').textContent = 'Η ομάδα ολοκληρώθηκε';
      $('#exercise-context').textContent = '';
      summary.focus({ preventScroll: true });
      announce($('#summary-score').textContent);
      return;
    }
    const question = current();
    $('#exercise-question').dataset.questionId = question.id;
    $('#exercise-question').textContent = mode === 'overcall' ? 'Τι αγοράζεις;' : 'Τι απαντάς στον συμπαίκτη;';
    $('#exercise-progress').textContent = `Άσκηση ${session.index + 1} από ${session.questions.length}`;
    $('#exercise-context').textContent = `1NT: ${question.ntRange} πόντοι · Χωρίς μανς`;
    const situation = mode === 'overcall' ? 'Η Ανατολή ανοίγει 1NT. Είναι η σειρά σου.' : 'Η Δύση ανοίγει 1NT. Ο συμπαίκτης παρεμβάλλεται και η Ανατολή πασάρει.';
    $('#exercise-situation').textContent = situation;
    drawHand(question); drawAuction(question);
    const selected = session.answers.get(question.id);
    drawBidding(question, selected ?? null);
    if (selected !== undefined) showFeedback(question, selected);
    $('.turn-label').textContent = selected === undefined ? 'Η σειρά σου' : 'Απάντησες';
    bidding.hidden = false; biddingHidden = false;
    $('#toggle-bidding').setAttribute('aria-expanded', 'true'); $('#toggle-bidding').textContent = 'ΑΠΟΚΡΥΨΗ';
    geometry();
    if (focus) $('#exercise-question').focus({ preventScroll: true });
    announce(`${$('#exercise-progress').textContent}. ${$('#exercise-context').textContent}. ${situation} ${question.auction.map(entry => POSITIONS[entry.seat] + ': ' + callSpeech(entry.call)).join('. ')}. Η σειρά σου.`);
  }
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => { mode = button.dataset.mode; render(true); }));
  $('#next-exercise').addEventListener('click', () => {
    const session = sessions[mode];
    if (session.index + 1 < session.questions.length) session.index++; else session.finished = true;
    render(true);
    (session.finished ? summary : $('#exercise-question')).scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  $('#restart-exercises').addEventListener('click', () => { sessions[mode] = start(mode); render(true); });
  $('#toggle-bidding').addEventListener('click', () => {
    biddingHidden = !biddingHidden; bidding.hidden = biddingHidden;
    $('#toggle-bidding').setAttribute('aria-expanded', String(!biddingHidden));
    $('#toggle-bidding').textContent = biddingHidden ? 'BIDDING BOX' : 'ΑΠΟΚΡΥΨΗ';
  });
  // As on the mobile table: inspect under the finger, submit on release.
  let touchCall = null;
  let touchPointer = null;
  const preview = node('div', { class: 'exercise-bid-preview', 'aria-hidden': 'true', hidden: '' });
  $('.exercise-bidding-area').append(preview);
  const inspectTouch = event => {
    const hit = document.elementFromPoint(event.clientX, event.clientY)?.closest('button[data-call]');
    touchCall = hit && bidding.contains(hit) && !hit.disabled ? hit.dataset.call : null;
    preview.hidden = !touchCall;
    if (!touchCall) return;
    const rect = hit.getBoundingClientRect();
    const bounds = $('.exercise-bidding-area').getBoundingClientRect();
    preview.textContent = callLabel(touchCall);
    preview.style.color = touchCall === 'PASS' ? '#2e7d32' : touchCall === 'X' ? '#c62828' : COLORS[touchCall.slice(1)] || '#0a3c6a';
    preview.style.width = rect.width * 1.60 + 'px';
    preview.style.height = rect.height * 1.60 + 'px';
    preview.style.left = Math.max(0, Math.min(bounds.width - rect.width * 1.60, rect.left - bounds.left - rect.width * .30)) + 'px';
    preview.style.top = rect.top - bounds.top - rect.height * .80 + 'px';
  };
  bidding.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' || window.innerWidth >= 768 || sessions[mode].answers.has(current().id)) return;
    event.preventDefault(); touchPointer = event.pointerId;
    bidding.setPointerCapture(event.pointerId); inspectTouch(event);
  });
  bidding.addEventListener('pointermove', event => { if (event.pointerId === touchPointer) { event.preventDefault(); inspectTouch(event); } });
  bidding.addEventListener('pointerup', event => {
    if (event.pointerId !== touchPointer) return;
    event.preventDefault(); inspectTouch(event);
    const call = touchCall; touchPointer = null; touchCall = null; preview.hidden = true;
    if (bidding.hasPointerCapture(event.pointerId)) bidding.releasePointerCapture(event.pointerId);
    if (call) select(call);
  });
  bidding.addEventListener('pointercancel', () => { touchPointer = null; touchCall = null; preview.hidden = true; });
  new ResizeObserver(geometry).observe(table);
  window.addEventListener('resize', geometry);
  render();
}
if (typeof document !== 'undefined') initializeExercises();
