import { SOUND_SAMPLE_RATE, synthesizeGameSound, type GameSound, type TurnSoundSnapshot } from './sound-palette';

type BoardSoundState = { step: number; revision: number; lastTurn: string | null };
let scope: string | null = null;
let enabled = false;
let context: AudioContext | null = null;
// Recovery is event-driven and bounded; it never queues a game cue.
const AUDIO_RESUME_TIMEOUT_MS = 1500;
const AUDIO_CLOCK_CHECK_MS = 300;
type AudioRecovery = {
  audio: AudioContext;
  gesture: boolean;
  timer: ReturnType<typeof setTimeout>;
};
let recovery: AudioRecovery | null = null;
let clockCheck: { audio: AudioContext; timer: ReturnType<typeof setTimeout> } | null = null;
let unhealthy = false;
let boards = new Map<string, BoardSoundState>();
const buffers = new Map<GameSound, AudioBuffer>();
type SoundCandidate = { sound: GameSound; owner: string; allowed?: () => boolean };
const sources = new Map<AudioBufferSourceNode, SoundCandidate & { stop: () => void }>();
let batch: SoundCandidate[] = [];
let batchTimer: ReturnType<typeof setTimeout> | null = null;
// Coalesce notifications and React effects from the same update before any cue starts.
const SOUND_BATCH_MS = 32;
const storageKey = (key: string) => `leonardo:turn-sounds:${key}`;
const visible = () => typeof document !== 'undefined' && document.visibilityState !== 'hidden';

function saveLedger() {
  if (!scope || typeof window === 'undefined') return;
  try { window.sessionStorage.setItem(storageKey(scope), JSON.stringify([...boards])); }
  catch { /* Navigation retains memory when browser storage is unavailable. */ }
}
export function stopMatchingGameSounds(matches: (sound: GameSound, owner: string) => boolean) {
  batch = batch.filter(candidate => !matches(candidate.sound, candidate.owner));
  if (!batch.length && batchTimer !== null) {
    clearTimeout(batchTimer);
    batchTimer = null;
  }
  for (const playback of sources.values()) {
    if (matches(playback.sound, playback.owner)) playback.stop();
  }
}
export function stopTurnSounds() {
  stopMatchingGameSounds(sound => sound === 1 || sound === 2);
}
export function stopGameSounds() {
  stopMatchingGameSounds(() => true);
}
export function canPlayGameAudio(expectedScope: string | null) {
  return Boolean(scope && scope === expectedScope && enabled && visible() && !unhealthy && context?.state === 'running');
}

function clearAudioRecovery() {
  if (recovery) clearTimeout(recovery.timer);
  if (clockCheck) clearTimeout(clockCheck.timer);
  recovery = null;
  clockCheck = null;
}

function replaceAudioContext() {
  const previous = context;
  clearAudioRecovery();
  stopGameSounds();
  context = null;
  buffers.clear();
  if (previous) {
    previous.onstatechange = null;
    try { void previous.close().catch(() => undefined); } catch { /* Already unavailable. */ }
  }
}

function recoveryFailed(audio: AudioContext) {
  if (context !== audio) return;
  clearAudioRecovery();
  if (!enabled || !visible()) return;
  unhealthy = true;
  stopGameSounds();
  // Replace only during the next real gesture, when autoplay can be unlocked.
}

function checkAudioClock(audio: AudioContext) {
  if (clockCheck || context !== audio || unhealthy || !enabled || !visible()) return;
  const startedAt = audio.currentTime;
  if (!Number.isFinite(startedAt)) return;
  const check = { audio, timer: setTimeout(() => {
    if (clockCheck !== check) return;
    clockCheck = null;
    if (context !== audio || !enabled || !visible() || unhealthy) return;
    // Some engines report running after interruption while their clock is frozen.
    if (audio.state === 'running' && audio.currentTime <= startedAt) {
      recoveryFailed(audio);
    }
  }, AUDIO_CLOCK_CHECK_MS) };
  clockCheck = check;
}

function ensureGameAudio(gesture: boolean) {
  if (typeof window === 'undefined' || !visible()) return;
  try {
    const Audio = window.AudioContext
      ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Audio) return;
    if (!context || context.state === 'closed' || unhealthy) {
      if (!gesture) return;
      replaceAudioContext();
      const audio = new Audio();
      context = audio;
      unhealthy = false;
      audio.onstatechange = () => {
        if (context !== audio) return;
        if (audio.state !== 'running') stopGameSounds();
        if (audio.state === 'closed') {
          clearAudioRecovery();
          unhealthy = true;
        } else if (enabled && visible() && !unhealthy) {
          ensureGameAudio(false);
        }
      };
    }
    const audio = context;
    if (audio.state === 'running') {
      if (recovery) {
        clearTimeout(recovery.timer);
        recovery = null;
      }
      checkAudioClock(audio);
      return;
    }
    // A foreground resume may be waiting for user activation. That next gesture
    // must call resume synchronously even though an automatic attempt is pending.
    if (recovery?.audio === audio && (!gesture || recovery.gesture)) return;
    if (recovery) clearTimeout(recovery.timer);
    if (clockCheck) clearTimeout(clockCheck.timer);
    clockCheck = null;
    const attempt: AudioRecovery = {
      audio, gesture,
      timer: setTimeout(() => {
        if (context !== audio || recovery !== attempt) return;
        if (audio.state === 'running') {
          recovery = null;
          checkAudioClock(audio);
        } else recoveryFailed(audio);
      }, AUDIO_RESUME_TIMEOUT_MS),
    };
    recovery = attempt;
    try {
      const resumed = audio.resume();
      // resume() can change the native state before returning its promise.
      if ((audio.state as AudioContextState) === 'running' && recovery === attempt) {
        clearTimeout(attempt.timer);
        recovery = null;
        checkAudioClock(audio);
      }
      void resumed.then(() => {
        if (context !== audio || recovery !== attempt) return;
        clearTimeout(attempt.timer);
        recovery = null;
        if (audio.state === 'running') checkAudioClock(audio);
        else recoveryFailed(audio);
      }, () => {
        if (context === audio && recovery === attempt) recoveryFailed(audio);
      });
    } catch {
      if (recovery === attempt) recoveryFailed(audio);
    }
  } catch { /* Audio support must never block the game or the screen reader. */ }
}

export function recoverGameAudio() {
  if (enabled && visible()) ensureGameAudio(false);
}

export function pauseGameAudio() {
  clearAudioRecovery();
  stopGameSounds();
}

// Agreed groups: deal, time warning, response request, seated, turn, chat, acceptance.
// Own and dummy turns are mutually exclusive; dealing also wins over future cues.
export function selectGameSound(sounds: readonly GameSound[]): GameSound | null {
  const kinds = new Set(sounds);
  if (kinds.has(4)) return 4;
  if (kinds.has(8)) return 8;
  if (kinds.has(6)) return 6;
  if (kinds.has(3)) return 3;
  const turns = [...kinds].filter(sound => sound === 1 || sound === 2);
  if (turns.length === 1) return turns[0];
  if (turns.length > 1) return null;
  if (kinds.has(7)) return 7;
  if (kinds.size === 1 && kinds.has(5)) return 5;
  return null;
}

function playAudio(candidate: SoundCandidate) {
  if (!context) return;
  let buffer = buffers.get(candidate.sound);
  if (!buffer) {
    const samples = synthesizeGameSound(candidate.sound);
    buffer = context.createBuffer(1, samples.length, SOUND_SAMPLE_RATE);
    buffer.getChannelData(0).set(samples);
    buffers.set(candidate.sound, buffer);
  }
  const source = context.createBufferSource();
  let active = true;
  const cleanup = () => { sources.delete(source); source.disconnect(); };
  const stop = () => {
    if (!active) return;
    active = false;
    source.onended = null;
    try { source.stop(); } catch { /* Already ended. */ }
    cleanup();
  };
  source.buffer = buffer;
  source.connect(context.destination);
  source.onended = () => {
    if (!active) return;
    active = false;
    cleanup();
  };
  sources.set(source, { ...candidate, stop });
  try { source.start(); }
  catch (error) { stop(); throw error; }
}

export function requestGameAudio(sound: GameSound, owner: string, expectedScope: string | null, allowed?: () => boolean) {
  if (!canPlayGameAudio(expectedScope)) return;
  batch.push({ sound, owner, allowed });
  if (batchTimer !== null) return;
  batchTimer = setTimeout(() => {
    batchTimer = null;
    const candidates = batch;
    batch = [];
    if (!canPlayGameAudio(expectedScope)) return;
    try {
      const available = candidates.filter(candidate => !candidate.allowed || candidate.allowed());
      const winner = selectGameSound(available.map(candidate => candidate.sound));
      const selected = available.find(candidate => candidate.sound === winner);
      if (!selected) return;
      stopGameSounds();
      playAudio(selected);
    } catch { /* Audio never interrupts game state, speech or focus. */ }
    // Losing events have already been consumed; nothing is retained or replayed.
  }, SOUND_BATCH_MS);
}
export function configureGameSounds(nextScope: string | null, nextEnabled: boolean) {
  if (scope !== nextScope) {
    clearAudioRecovery();
    stopGameSounds();
    scope = nextScope;
    boards = new Map();
    try {
      const saved = scope && typeof window !== 'undefined' ? window.sessionStorage.getItem(storageKey(scope)) : null;
      const parsed: unknown = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed)) {
        for (const entry of parsed.slice(-128)) {
          if (!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== 'string') continue;
          const state = entry[1] as Partial<BoardSoundState> | null;
          if (state && Number.isSafeInteger(state.step) && Number.isSafeInteger(state.revision)
            && typeof state.step === 'number' && state.step >= 0
            && typeof state.revision === 'number' && state.revision >= 0
            && (state.lastTurn === null || typeof state.lastTurn === 'string')) {
            boards.set(entry[0], state as BoardSoundState);
          }
        }
      }
    } catch { /* Use a fresh in-memory ledger after unavailable or invalid storage. */ }
  }
  enabled = nextEnabled && Boolean(scope);
  if (!enabled) pauseGameAudio();
}

// Called synchronously from a real user action, including VoiceOver activation.
// Suspended/denied audio never queues old turns for a later gesture.
export function unlockGameAudio() {
  ensureGameAudio(true);
}

export function observeGameTurn(snapshot: TurnSoundSnapshot, expectedScope: string | null) {
  if (!scope || expectedScope !== scope) return;
  const previous = boards.get(snapshot.board);
  const revision = (previous?.revision ?? 0) + (previous && snapshot.step < previous.step ? 1 : 0);
  const turn = snapshot.turn === null ? null : `${revision}:${snapshot.turn}`;
  const fresh = turn !== null && turn !== previous?.lastTurn;
  const state = { step: snapshot.step, revision, lastTurn: fresh ? turn : previous?.lastTurn ?? null };
  if (!previous || previous.step !== state.step || previous.revision !== revision || previous.lastTurn !== state.lastTurn) {
    boards.delete(snapshot.board);
    boards.set(snapshot.board, state);
    if (boards.size > 128) boards.delete(boards.keys().next().value!);
    saveLedger();
  }
  if (!fresh || snapshot.sound === null) return;
  stopTurnSounds();
  requestGameAudio(snapshot.sound, `turn:${snapshot.board}`, expectedScope);
}
