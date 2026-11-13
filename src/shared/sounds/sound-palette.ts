export type TurnSound = 1 | 2;
export type GameSound = TurnSound | 3 | 4 | 5 | 6 | 7 | 8;
export type EventSound = 3 | 4 | 5 | 6 | 7 | 8;
export type TurnSoundSnapshot = {
  board: string;
  step: number;
  turn: string | null;
  sound: TurnSound | null;
};
export const SOUND_SAMPLE_RATE = 22050;
// One shared volume source: the agreed increase from 15 to 25.
export const GAME_SOUND_VOLUME = 0.035 * (25 / 15);
export const GAME_SOUND_DURATIONS: Record<GameSound, number> = {
  1: 0.24, 2: 0.24, 3: 0.45, 4: 1, 5: 0.62, 6: 0.46, 7: 0.10, 8: 0.54,
};
export const TURN_FREQUENCIES: Record<TurnSound, number> = {
  1: 523.25,
  2: 783.99,
};

// Each cue is one continuous note, with smooth edges to avoid clicks.
export function synthesizeGameSound(sound: GameSound): Float32Array {
  if (sound === 3 || sound === 4 || sound === 5 || sound === 6 || sound === 7 || sound === 8) return synthesizeEventSound(sound);
  const frequency = TURN_FREQUENCIES[sound];
  const duration = GAME_SOUND_DURATIONS[sound];
  const samples = new Float32Array(Math.ceil(duration * SOUND_SAMPLE_RATE));
  for (let i = 0; i < samples.length; i++) {
    const t = i / SOUND_SAMPLE_RATE;
    const fade = Math.min(1, t / 0.008, (duration - t) / 0.02);
    samples[i] = GAME_SOUND_VOLUME * fade * Math.exp(-t * 3) * Math.sin(2 * Math.PI * frequency * t);
  }
  return samples;
}

function synthesizeEventSound(sound: EventSound): Float32Array {
  const duration = GAME_SOUND_DURATIONS[sound];
  const samples = new Float32Array(Math.ceil(duration * SOUND_SAMPLE_RATE));
  const note = (frequency: number, start: number, length: number, volume: number, bell = false) => {
    const from = Math.round(start * SOUND_SAMPLE_RATE);
    for (let i = 0; i < Math.floor(length * SOUND_SAMPLE_RATE) && from + i < samples.length; i++) {
      const t = i / SOUND_SAMPLE_RATE;
      const edge = Math.min(1, t / 0.008, (length - t) / 0.025);
      const wave = Math.sin(2 * Math.PI * frequency * t)
        + (bell ? 0.2 * Math.sin(2 * Math.PI * frequency * 2.76 * t) : 0);
      samples[from + i] += volume * edge * Math.exp(-t * (bell ? 8 : 5)) * wave;
    }
  };
  if (sound === 3) note(1046.5, 0, 0.45, GAME_SOUND_VOLUME * 0.8, true);
  if (sound === 4) {
    let seed = 365, previous = 0;
    for (let i = 0; i < samples.length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const noise = seed / 4294967296 * 2 - 1;
      const t = i / SOUND_SAMPLE_RATE;
      const envelope = [0, 0.16, 0.32, 0.48, 0.64, 0.80].reduce((sum, start) => {
        const local = t - start;
        return sum + (local >= 0 && local < 0.20 ? Math.sin(Math.PI * local / 0.20) ** 2 : 0);
      }, 0);
      samples[i] = (noise - previous) * GAME_SOUND_VOLUME * (3 / 7) * envelope;
      previous = noise;
    }
  }
  if (sound === 5) [523.25, 659.25, 783.99].forEach((frequency, i) => note(frequency, i * 0.16, 0.30, GAME_SOUND_VOLUME * 0.6));
  if (sound === 6) {
    note(523.25, 0, 0.20, GAME_SOUND_VOLUME * 0.8);
    note(783.99, 0.24, 0.20, GAME_SOUND_VOLUME * 0.8);
  }
  if (sound === 7) {
    for (let i = 0; i < samples.length; i++) {
      const t = i / SOUND_SAMPLE_RATE;
      const edge = Math.min(1, t / 0.004, (duration - t) / 0.015);
      const phase = 2 * Math.PI * (900 * t - 2500 * t * t);
      samples[i] = GAME_SOUND_VOLUME * (6 / 7) * edge * Math.exp(-t * 45) * Math.sin(phase);
    }
  }
  if (sound === 8) {
    for (const start of [0, 0.18, 0.36]) note(880, start, 0.10, GAME_SOUND_VOLUME * 0.8);
  }
  return samples;
}
