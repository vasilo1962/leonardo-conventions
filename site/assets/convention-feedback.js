// The shared header owns preferences. Absence of its explicit sound flag is mute.
export function exerciseProgress(session) {
  return {
    current: session.index + 1,
    total: session.questions.length,
    answered: session.answers.size,
    correct: session.questions.filter(q => session.answers.get(q.id) === q.answer).length
  };
}

// Exact PCM synthesis of the auditioned single note: E5 with simultaneous harmonics.
export function correctAnswerSamples() {
  const rate = 48000;
  const duration = .65;
  const samples = new Float32Array(rate * duration);
  const harmonics = [[1, .24, .14], [2, .075, .095], [3, .032, .07], [4, .012, .05]];
  for (let i = 0; i < samples.length; i++) {
    const time = i / rate;
    let value = 0;
    for (const [harmonic, level, decay] of harmonics) {
      value += level * Math.exp(-time / decay) * Math.sin(2 * Math.PI * 659.255 * harmonic * time);
    }
    value *= Math.min(time / .008, 1) * Math.min((duration - time) / .04, 1);
    samples[i] = (Math.round(value * 32767) || 0) / 32768;
  }
  return samples;
}

export function createAnswerSounds(environment = window) {
  let context;
  let correctBuffer;
  let generation = 0;
  const playing = new Set();
  const enabled = () => environment.document.documentElement.dataset.soundsEnabled === 'true'
    && environment.document.visibilityState !== 'hidden';
  function stop() {
    generation++;
    for (const oscillator of playing) {
      try { oscillator.stop(); } catch {}
    }
    playing.clear();
  }
  function play(correct) {
    stop();
    if (!enabled()) return;
    const AudioContext = environment.AudioContext || environment.webkitAudioContext;
    if (!AudioContext) return;
    try {
      if (!context || context.state === 'closed') {
        context = new AudioContext();
        correctBuffer = undefined;
      }
      const audio = context;
      const request = generation;
      const start = () => {
        if (request !== generation || !enabled() || audio.state !== 'running') return;
        if (correct) {
          if (!correctBuffer) {
            const samples = correctAnswerSamples();
            correctBuffer = audio.createBuffer(1, samples.length, 48000);
            correctBuffer.getChannelData(0).set(samples);
          }
          const source = audio.createBufferSource();
          source.buffer = correctBuffer;
          source.connect(audio.destination);
          source.onended = () => { playing.delete(source); source.disconnect(); };
          playing.add(source);
          source.start();
          return;
        }
        const frequencies = [220, 165];
        for (const [index, frequency] of frequencies.entries()) {
          const oscillator = audio.createOscillator();
          const gain = audio.createGain();
          const time = audio.currentTime + index * .11;
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(frequency, time);
          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(.055, time + .008);
          gain.gain.linearRampToValueAtTime(0, time + .10);
          oscillator.connect(gain);
          gain.connect(audio.destination);
          oscillator.onended = () => { playing.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
          playing.add(oscillator);
          oscillator.start(time);
          oscillator.stop(time + .105);
        }
      };
      if (audio.state === 'running') start();
      else Promise.resolve(audio.resume()).then(start).catch(() => {});
    } catch { stop(); }
  }
  const observer = new environment.MutationObserver(() => { if (!enabled()) stop(); });
  observer.observe(environment.document.documentElement, { attributes: true, attributeFilter: ['data-sounds-enabled'] });
  environment.document.addEventListener('visibilitychange', () => { if (!enabled()) stop(); });
  environment.addEventListener('pagehide', stop);
  return { play, stop };
}
