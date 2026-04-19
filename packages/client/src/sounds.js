let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function playTone({ type = "sine", freq, freqEnd, duration, gain = 0.4, delay = 0, gainEnd = 0 }) {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.connect(g);
  g.connect(ac.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
  if (freqEnd !== undefined) osc.frequency.linearRampToValueAtTime(freqEnd, ac.currentTime + delay + duration);
  g.gain.setValueAtTime(gain, ac.currentTime + delay);
  g.gain.linearRampToValueAtTime(gainEnd, ac.currentTime + delay + duration);
  osc.start(ac.currentTime + delay);
  osc.stop(ac.currentTime + delay + duration);
}

export function playDiceRoll() {
  const ac = getCtx();
  // White noise burst for dice rattle
  for (let i = 0; i < 8; i++) {
    const buf = ac.createBuffer(1, ac.sampleRate * 0.05, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let j = 0; j < data.length; j++) data[j] = (Math.random() * 2 - 1) * 0.3;
    const src = ac.createBufferSource();
    const g = ac.createGain();
    src.buffer = buf;
    src.connect(g);
    g.connect(ac.destination);
    const t = ac.currentTime + i * 0.07;
    g.gain.setValueAtTime(0.4, t);
    g.gain.linearRampToValueAtTime(0, t + 0.05);
    src.start(t);
  }
  // Click at end
  playTone({ type: "square", freq: 300, freqEnd: 150, duration: 0.08, gain: 0.3, delay: 0.55, gainEnd: 0 });
}

export function playMove() {
  playTone({ type: "sine", freq: 520, freqEnd: 560, duration: 0.12, gain: 0.25, gainEnd: 0 });
}

export function playLadder() {
  // Ascending happy notes
  const notes = [330, 415, 494, 622, 740];
  notes.forEach((f, i) => {
    playTone({ type: "triangle", freq: f, duration: 0.18, gain: 0.35, delay: i * 0.13, gainEnd: 0 });
  });
}

export function playSnake() {
  // Descending sad notes
  const notes = [440, 370, 311, 261];
  notes.forEach((f, i) => {
    playTone({ type: "sawtooth", freq: f, freqEnd: f * 0.85, duration: 0.2, gain: 0.2, delay: i * 0.15, gainEnd: 0 });
  });
}

export function playCorrect() {
  // Bright ding-dong: two quick ascending bell tones
  playTone({ type: "sine", freq: 880,  duration: 0.18, gain: 0.45, delay: 0,    gainEnd: 0 });
  playTone({ type: "sine", freq: 1109, duration: 0.25, gain: 0.4,  delay: 0.16, gainEnd: 0 });
  playTone({ type: "sine", freq: 1319, duration: 0.35, gain: 0.35, delay: 0.30, gainEnd: 0 });
}

export function playWin() {
  // Full victory fanfare with harmony
  const melody = [
    { f: 523, d: 0.12 }, { f: 523, d: 0.12 }, { f: 523, d: 0.12 },
    { f: 523, d: 0.28 }, { f: 415, d: 0.28 }, { f: 466, d: 0.28 },
    { f: 523, d: 0.55 },
  ];
  const harmony = [
    { f: 659, d: 0.12 }, { f: 659, d: 0.12 }, { f: 659, d: 0.12 },
    { f: 659, d: 0.28 }, { f: 523, d: 0.28 }, { f: 587, d: 0.28 },
    { f: 659, d: 0.55 },
  ];
  let t = 0;
  melody.forEach(({ f, d }, i) => {
    playTone({ type: "triangle", freq: f,           duration: d * 0.88, gain: 0.45, delay: t, gainEnd: 0 });
    playTone({ type: "triangle", freq: harmony[i].f, duration: d * 0.88, gain: 0.25, delay: t, gainEnd: 0 });
    t += d;
  });
  // Final sparkle
  [1047, 1319, 1568, 2093].forEach((f, i) =>
    playTone({ type: "sine", freq: f, duration: 0.15, gain: 0.2, delay: t + i * 0.07, gainEnd: 0 })
  );
}
