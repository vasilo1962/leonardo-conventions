// The shared header owns preferences. Absence of its explicit sound flag is mute.
export function exerciseProgress(session) {
  return {
    current: session.index + 1,
    total: session.questions.length,
    answered: session.answers.size,
    correct: session.questions.filter(q => session.answers.get(q.id) === q.answer).length
  };
}

export function createAnswerSounds(environment = window) {
  let context;
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
      if (!context || context.state === 'closed') context = new AudioContext();
      const audio = context;
      const request = generation;
      const start = () => {
        if (request !== generation || !enabled() || audio.state !== 'running') return;
        const frequencies = correct ? [660, 880] : [220, 165];
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
