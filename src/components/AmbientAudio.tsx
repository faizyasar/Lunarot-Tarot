import { useEffect, useRef, useState } from 'react';

interface AmbientAudioProps {
  enabled?: boolean;
}

interface SFXTriggers {
  cardFlip?: number;   // increment to trigger
  cardDraw?: number;
  anomaly?: number;
  purge?: number;
  bootComplete?: number;
  spreadOpen?: number;
}

// Export a custom event system for triggering sounds
let globalTriggers: SFXTriggers = {};
let triggerHandlers: (() => void)[] = [];

export function triggerSFX(event: keyof SFXTriggers) {
  globalTriggers = { ...globalTriggers, [event]: (globalTriggers[event] || 0) + 1 };
  triggerHandlers.forEach(h => h());
}

export default function AmbientAudio({ enabled = true }: AmbientAudioProps) {
  const [isMuted, setIsMuted] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const droneNodesRef = useRef<OscillatorNode[]>([]);
  const gainRef = useRef<GainNode | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const handler = () => {
      if (!initializedRef.current && enabled) {
        initAudio();
        initializedRef.current = true;
      }
    };
    triggerHandlers.push(handler);
    return () => {
      triggerHandlers = triggerHandlers.filter(h => h !== handler);
    };
  }, [enabled]);

  // Listen for SFX triggers
  useEffect(() => {
    let lastFlip = globalTriggers.cardFlip || 0;
    let lastDraw = globalTriggers.cardDraw || 0;
    let lastAnomaly = globalTriggers.anomaly || 0;
    let lastPurge = globalTriggers.purge || 0;
    let lastBoot = globalTriggers.bootComplete || 0;
    let lastSpread = globalTriggers.spreadOpen || 0;

    const interval = setInterval(() => {
      if (isMuted || !ctxRef.current) return;

      const ctx = ctxRef.current;
      const g = globalTriggers;

      if ((g.cardFlip || 0) > lastFlip) {
        lastFlip = g.cardFlip || 0;
        playFlipSound(ctx);
      }
      if ((g.cardDraw || 0) > lastDraw) {
        lastDraw = g.cardDraw || 0;
        playDrawSound(ctx);
      }
      if ((g.anomaly || 0) > lastAnomaly) {
        lastAnomaly = g.anomaly || 0;
        playAnomalySound(ctx);
      }
      if ((g.purge || 0) > lastPurge) {
        lastPurge = g.purge || 0;
        playPurgeSound(ctx);
      }
      if ((g.bootComplete || 0) > lastBoot) {
        lastBoot = g.bootComplete || 0;
        playBootSound(ctx);
      }
      if ((g.spreadOpen || 0) > lastSpread) {
        lastSpread = g.spreadOpen || 0;
        playSpreadSound(ctx);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isMuted]);

  const initAudio = () => {
    try {
      const ctx = new AudioContext();
      ctxRef.current = ctx;

      // Master gain
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.12;
      masterGain.connect(ctx.destination);
      gainRef.current = masterGain;

      // Drone layer 1: Deep sub-bass (50Hz, slightly detuned)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 50;
      const gain1 = ctx.createGain();
      gain1.gain.value = 0.5;
      osc1.connect(gain1);
      gain1.connect(masterGain);
      osc1.start();
      droneNodesRef.current.push(osc1);

      // Drone layer 2: Fifth above (75Hz)
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = 75.5;
      const gain2 = ctx.createGain();
      gain2.gain.value = 0.3;
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start();
      droneNodesRef.current.push(osc2);

      // Drone layer 3: High shimmer (very quiet)
      const osc3 = ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.value = 200;
      const gain3 = ctx.createGain();
      gain3.gain.value = 0.08;

      // Slow LFO on shimmer
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.15;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.04;
      lfo.connect(lfoGain);
      lfoGain.connect(gain3.gain);
      lfo.start();

      osc3.connect(gain3);
      gain3.connect(masterGain);
      osc3.start();
      droneNodesRef.current.push(osc3);

      // Drone layer 4: Choir-like beating (50Hz + 50.3Hz)
      const osc4 = ctx.createOscillator();
      osc4.type = 'sine';
      osc4.frequency.value = 50.3;
      const gain4 = ctx.createGain();
      gain4.gain.value = 0.4;
      osc4.connect(gain4);
      gain4.connect(masterGain);
      osc4.start();
      droneNodesRef.current.push(osc4);

    } catch (e) {
      console.warn('[AMBIENT] Audio init failed:', e);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (gainRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(
          next ? 0 : 0.12,
          (gainRef.current.context.currentTime + 0.3)
        );
      }
      return next;
    });
  };

  // Cleanup
  useEffect(() => {
    return () => {
      droneNodesRef.current.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 font-mono text-[7px] tracking-[0.2em] uppercase border px-2 py-1 cursor-pointer transition-all bg-black/60 backdrop-blur-sm"
      style={{
        borderColor: isMuted ? 'rgba(255,255,255,0.1)' : 'rgba(200,164,90,0.3)',
        color: isMuted ? 'rgba(255,255,255,0.15)' : 'rgba(200,164,90,0.6)',
      }}
      title={isMuted ? 'UNMUTE AMBIENCE' : 'MUTE AMBIENCE'}
    >
      {isMuted ? '◉ MUTED' : '◉ DRONE'}
    </button>
  );
}

// ─── SFX Functions ───

function playFlipSound(ctx: AudioContext) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.12);
}

function playDrawSound(ctx: AudioContext) {
  const now = ctx.currentTime;
  // Paper slide + low thud
  const noise = ctx.createOscillator();
  noise.type = 'sawtooth';
  noise.frequency.setValueAtTime(120, now);
  noise.frequency.exponentialRampToValueAtTime(40, now + 0.25);
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.08, now);
  ng.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  noise.connect(ng);
  ng.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.3);

  // Thud
  const thud = ctx.createOscillator();
  thud.type = 'sine';
  thud.frequency.setValueAtTime(60, now + 0.05);
  thud.frequency.exponentialRampToValueAtTime(25, now + 0.3);
  const tg = ctx.createGain();
  tg.gain.setValueAtTime(0.2, now + 0.05);
  tg.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  thud.connect(tg);
  tg.connect(ctx.destination);
  thud.start(now + 0.05);
  thud.stop(now + 0.4);
}

function playAnomalySound(ctx: AudioContext) {
  const now = ctx.currentTime;
  // Discordant chord
  [200, 237, 311, 425].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    osc.detune.value = i * 15;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.06, now + i * 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now + i * 0.02);
    osc.stop(now + 0.8);
  });
}

function playPurgeSound(ctx: AudioContext) {
  const now = ctx.currentTime;
  // Fire crackle + ascending tone
  for (let i = 0; i < 8; i++) {
    const t = now + i * 0.05;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500 + Math.random() * 2000, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.06);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.04, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  // Rising tone
  const rise = ctx.createOscillator();
  rise.type = 'sine';
  rise.frequency.setValueAtTime(100, now);
  rise.frequency.exponentialRampToValueAtTime(800, now + 1.5);
  const rg = ctx.createGain();
  rg.gain.setValueAtTime(0.1, now);
  rg.gain.linearRampToValueAtTime(0.15, now + 0.8);
  rg.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
  rise.connect(rg);
  rg.connect(ctx.destination);
  rise.start(now);
  rise.stop(now + 1.5);
}

function playBootSound(ctx: AudioContext) {
  const now = ctx.currentTime;
  // Completion chime
  [523, 659, 784].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.12, now + i * 0.12);
    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 0.4);
  });
}

function playSpreadSound(ctx: AudioContext) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.5);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.08, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.6);
}
