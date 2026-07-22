
  (function() {
    function clearSelection() {
      if (window.getSelection) {
        const sel = window.getSelection();
        if (sel && sel.removeAllRanges) {
          const active = document.activeElement;
          if (!active || (active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA')) {
            sel.removeAllRanges();
          }
        }
      }
    }

    ['selectstart', 'contextmenu', 'dragstart'].forEach(function(evtName) {
      document.addEventListener(evtName, function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          return false;
        }
      }, { capture: true, passive: false });
    });

    ['selectionchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup'].forEach(function(evtName) {
      document.addEventListener(evtName, function(e) {
        clearSelection();
      }, { capture: true, passive: true });
    });
  })();

const SUITS = [
  { key: "cups", num: "♥", glyph: "♥", tradition: "water" },
  { key: "wands", num: "🔥", glyph: "🔥", tradition: "fire" },
  { key: "pentacles", num: "◈", glyph: "◈", tradition: "earth" },
  { key: "swords", num: "⚔", glyph: "⚔", tradition: "air" },
];
const RANKS = ["Ace", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const MAJORS = [
  { name: "The Sun", glyph: "✧" },
  { name: "The Star", glyph: "✦" },
  { name: "The World", glyph: "✺" },
  { name: "Wheel of Fortune", glyph: "☸" },
  { name: "The Tower", glyph: "▲" },
  { name: "The Devil", glyph: "◭" },
  { name: "Death", glyph: "☠" },
];
function buildDeck() {
  const deck = [];
  SUITS.forEach((s) => {
    RANKS.forEach((r) => {
      deck.push({ name: `${r} of ${s.key[0].toUpperCase()}${s.key.slice(1)}`, num: `${r} ${s.num}`, glyph: s.glyph, tradition: s.tradition, major: false });
    });
  });
  MAJORS.forEach((m) => deck.push({ name: m.name, num: "0", glyph: m.glyph, tradition: "cosmos", major: true }));
  return deck;
}
const DECK = buildDeck();

const FAULTY_TERMINAL_VERT = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
const FAULTY_TERMINAL_FRAG = `
precision mediump float;
varying vec2 vUv;
uniform float iTime;
uniform vec3  iResolution;
uniform float uScale;
uniform vec2  uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uNoiseAmp;
uniform float uChromaticAberration;
uniform float uDither;
uniform float uCurvature;
uniform vec3  uTint;
uniform vec2  uMouse;
uniform float uMouseStrength;
uniform float uUseMouse;
uniform float uPageLoadProgress;
uniform float uUsePageLoadAnimation;
uniform float uBrightness;
float time;
float hash21(vec2 p){
  p = fract(p * 234.56);
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2;
}
mat2 rotate(float angle){
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}
float fbm(vec2 p){
  p *= 1.1;
  float f = 0.0;
  float amp = 0.5 * uNoiseAmp;
  mat2 modify0 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify0 * p * 2.0;
  amp *= 0.454545;
  mat2 modify1 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify1 * p * 2.0;
  amp *= 0.454545;
  mat2 modify2 = rotate(time * 0.08);
  f += amp * noise(p);
  return f;
}
float pattern(vec2 p, out vec2 q, out vec2 r) {
  vec2 offset1 = vec2(1.0);
  vec2 offset0 = vec2(0.0);
  mat2 rot01 = rotate(0.1 * time);
  mat2 rot1 = rotate(0.1);
  q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));
  r = vec2(fbm(rot1 * q + offset0), fbm(q + offset0));
  return fbm(p + r);
}
float digit(vec2 p){
    vec2 grid = uGridMul * 15.0;
    vec2 s = floor(p * grid) / grid;
    p = p * grid;
    vec2 q, r;
    float intensity = pattern(s * 0.1, q, r) * 1.3 - 0.03;
    if(uUseMouse > 0.5){
        vec2 mouseWorld = uMouse * uScale;
        float distToMouse = distance(s, mouseWorld);
        float mouseInfluence = exp(-distToMouse * 8.0) * uMouseStrength * 10.0;
        intensity += mouseInfluence;
        float ripple = sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;
        intensity += ripple;
    }
    if(uUsePageLoadAnimation > 0.5){
        float cellRandom = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453);
        float cellDelay = cellRandom * 0.8;
        float cellProgress = clamp((uPageLoadProgress - cellDelay) / 0.2, 0.0, 1.0);
        float fadeAlpha = smoothstep(0.0, 1.0, cellProgress);
        intensity *= fadeAlpha;
    }
    p = fract(p);
    p *= uDigitSize;
    float px5 = p.x * 5.0;
    float py5 = (1.0 - p.y) * 5.0;
    float x = fract(px5);
    float y = fract(py5);
    float i = floor(py5) - 2.0;
    float j = floor(px5) - 2.0;
    float n = i * i + j * j;
    float f = n * 0.0625;
    float isOn = step(0.1, intensity - f);
    float brightness = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);
    return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * brightness;
}
float onOff(float a, float b, float c){
  return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
}
float displace(vec2 look){
    float y = look.y - mod(iTime * 0.25, 1.0);
    float window = 1.0 / (1.0 + 50.0 * y * y);
    return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window;
}
vec3 getColor(vec2 p){
    float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;
    bar *= uScanlineIntensity;
    float displacement = displace(p);
    p.x += displacement;
    if (uGlitchAmount != 1.0) {
      float extra = displacement * (uGlitchAmount - 1.0);
      p.x += extra;
    }
    float middle = digit(p);
    const float off = 0.002;
    float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + digit(p + vec2(off, -off)) +
                digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0)) + digit(p + vec2(off, 0.0)) +
                digit(p + vec2(-off, off)) + digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));
    vec3 baseColor = vec3(0.9) * middle + sum * 0.1 * vec3(1.0) * bar;
    return baseColor;
}
vec2 barrel(vec2 uv){
  vec2 c = uv * 2.0 - 1.0;
  float r2 = dot(c, c);
  c *= 1.0 + uCurvature * r2;
  return c * 0.5 + 0.5;
}
void main() {
    time = iTime * 0.333333;
    vec2 uv = vUv;
    if(uCurvature != 0.0){
      uv = barrel(uv);
    }
    vec2 p = uv * uScale;
    vec3 col = getColor(p);
    if(uChromaticAberration != 0.0){
      vec2 ca = vec2(uChromaticAberration) / iResolution.xy;
      col.r = getColor(p + ca).r;
      col.b = getColor(p - ca).b;
    }
    col *= uTint;
    col *= uBrightness;
    if(uDither > 0.0){
      float rnd = hash21(gl_FragCoord.xy);
      col += (rnd - 0.5) * (uDither * 0.003922);
    }
    gl_FragColor = vec4(col, 1.0);
}
`;

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
const SIGIL_GLYPHS = ["⛧","✦","🜏","☽","✶","🜃","◈","🜄"];
const SIGIL_POS = [
  { left: "6%", top: "8%" }, { left: "80%", top: "10%" }, { left: "14%", top: "40%" }, { left: "76%", top: "42%" },
  { left: "2%", top: "68%" }, { left: "86%", top: "66%" }, { left: "40%", top: "2%" }, { left: "50%", top: "80%" },
];

function buildPalette(mode) {
  // 6-stop ramp: near-black base -> deep red -> ember -> orange mid -> yellow -> white-hot core.
  const bands =
    mode === "curse" ? ["#1a0000", "#4a0808", "#8f0f0f", "#c9223a", "#e8452b", "#ffd8c2"] :
    mode === "buff" ? ["#001210", "#052b25", "#0a5c4c", "#0f8f6f", "#4fe0b8", "#eafff6"] :
    ["#140400", "#4a1200", "#7a1f00", "#c9490f", "#f0a020", "#fff2b0"];
  const stops = ["rgba(0,0,0,0)"];
  for (let i = 1; i < 40; i++) {
    const band = Math.min(bands.length - 1, Math.floor((i / 39) * bands.length));
    stops.push(bands[band]);
  }
  return stops;
}
const BAYER4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
const KABBALIST_GLYPHS = ["א", "ל", "ם", "ת", "ש", "ה", "✡", "◬"];
const PALETTES = { fire: buildPalette("fire"), buff: buildPalette("buff"), curse: buildPalette("curse") };

function flameHalfWidth(rLocal, flameRows, mid) {
  const tipRows = 1; // short, sharp point — only the very first row stays needle-thin
  let hw;
  if (rLocal < tipRows) {
    hw = rLocal < tipRows - 1 ? 0 : 1;
  } else {
    const t2 = (rLocal - tipRows) / (flameRows - 1 - tipRows);
    hw = Math.round(Math.pow(t2, 1.1) * mid);
  }
  const fromBottom = flameRows - 1 - rLocal;
  if (fromBottom === 0) hw = Math.max(0, hw - 4); // rounded bottom: curve inward at the base
  else if (fromBottom === 1) hw = Math.max(0, hw - 3);
  else if (fromBottom === 2) hw = Math.max(0, hw - 2);
  else if (fromBottom === 3) hw = Math.max(0, hw - 1);
  if (rLocal === 0) hw = 0;
  return hw;
}
function buildFlameBuffer(buf, FW, FH, flameRows, skyRows, sourceVal, swayPhase) {
  const mid = (FW - 1) / 2;
  for (let row = 0; row < FH; row++) {
    const rLocal = row - skyRows;
    for (let x = 0; x < FW; x++) {
      let v = 0;
      if (rLocal >= 0 && sourceVal > 0) {
        const t = rLocal / (flameRows - 1); // 0 = tip, 1 = base
        const hw = flameHalfWidth(rLocal, flameRows, mid);
        // Asymmetric lean: the tip sways independently of the grounded base (never lockstep).
        const sway = Math.sin(swayPhase + t * 1.6) * (1 - t) * 1.3;
        const lit = hw <= 0 ? (x === Math.round(mid + sway)) : (Math.abs(x - mid - sway) <= hw + 0.001);
        if (lit) {
          const base = lerp(sourceVal * 0.42, sourceVal, t);
          v = Math.max(0, Math.round(base - Math.random() * 6));
        }
      }
      buf[row * FW + x] = v;
    }
  }
  // Ash bed grounding the flame at its fuel source.
  const baseRow = FH - 1;
  buf[baseRow * FW + Math.round(mid - 1)] = buf[baseRow * FW + Math.round(mid - 1)] > 0 ? 1 : 0;
  buf[baseRow * FW + Math.round(mid + 1)] = buf[baseRow * FW + Math.round(mid + 1)] > 0 ? 1 : 0;
}
function updateParticles(list, spawnFn, spawnChance) {
  if (Math.random() < spawnChance) list.push(spawnFn());
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i];
    p.x += p.vx; p.y += p.vy; p.life--;
    if (p.rot !== undefined) p.rot += p.vrot;
    p.alpha = Math.max(0, p.life / p.maxLife);
    if (p.life <= 0 || p.y < -6 || p.y > 60) list.splice(i, 1);
  }
}

class Component extends DCLogic {
  state = {
    beads: (this.props && this.props.startingBeads) || 5,
    score: 0,
    message: "sacred conduit primed // tap the board to drop a bead",
    drawnCards: [],
    activeCard: null,
    revealedActive: false,
    flyState: "none",
    gameOver: false,
    win: false,
    restarting: false,
    eyeMode: "normal",
    shaking: false,
    handHit: false,
    burningPips: [],
    phase: "intro",
    endMode: null,
    deathParticles: [],
  };

  DESIGN_W = 480;
  DESIGN_H = 680;
  WALL = 14;
  playTop = 26;
  gates = [
    { label: "VOID", symbol: "◌", color: "#5b6472" },
    { label: "CUPS", symbol: "♥", color: "#38bdf8" },
    { label: "WANDS", symbol: "▲", color: "#ef4444" },
    { label: "COSMOS", symbol: "✺", color: "#e3b341" },
    { label: "EARTH", symbol: "◈", color: "#10b981" },
    { label: "AIR", symbol: "⚔", color: "#a78bfa" },
    { label: "VOID", symbol: "◌", color: "#5b6472" },
  ];
  balls = [];
  pegs = [];
  particles = [];
  boardTilt = 0;
  boardTiltTarget = 0;
  boardTiltTimer = 200;
  headTiltPulse = 0;
  headShakeTimer = 260;
  termFrameSkip = 0;
  termGlyphs = "01アイウエオカキクケコサシスセソ$%#*+=<>";
  crtGlitchTimer = 90;
  FW = 14;
  FLAME_ROWS = 24;
  SKY_ROWS = 10;
  FH = 34;
  fireFrameSkip = 0;
  fireBufL = new Uint8Array(this.FW * this.FH);
  fireBufR = new Uint8Array(this.FW * this.FH);
  ashL = []; ashR = []; emberL = []; emberR = [];
  explodeTimer = 0;
  flareBoost = 0;
  time = 0;
  handState = { fl: 0, fr: 0, bl: 0, br: 0 };

  componentDidMount() {
    this.playLeft = this.WALL;
    this.playRight = this.DESIGN_W - this.WALL;
    this.playBottom = this.DESIGN_H - 84;
    this.buildPegs();
    this.resize();
    this._resizeHandler = () => { this.resize(); };
    window.addEventListener("resize", this._resizeHandler);
    this._interval = setInterval(() => this.tick(), 16);
    this.mouseNX = 0; this.mouseNY = 0;
    this._mouseHandler = (e) => {
      this.mouseNX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseNY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", this._mouseHandler);
    this._introTimer = setTimeout(() => this.setState({ phase: "play" }), 5000);
  }

  previewIntro = () => {
    clearTimeout(this._introTimer);
    this.setState({ phase: "intro" });
    this._introTimer = setTimeout(() => this.setState({ phase: "play" }), 5000);
  };

  previewEnding = (mode) => {
    if (this.sceneEl) { this.sceneEl.style.transform = ""; this.sceneEl.style.opacity = ""; }
    if (this.boardCanvas) { this.boardCanvas.style.opacity = ""; this.boardCanvas.style.filter = ""; }
    if (this.darkenEl) { this.darkenEl.style.opacity = "0"; this.darkenEl.style.background = "#000"; }
    if (this.mainLeftHandEl) this.mainLeftHandEl.style.transform = "";
    if (this.mainRightHandEl) this.mainRightHandEl.style.transform = "";
    this.setState({ phase: "play", gameOver: false, win: false, endMode: null, deathParticles: [] });
    setTimeout(() => this.beginEnding(mode), 30);
  };

  beginEnding(mode) {
    if (this.state.phase === "ending" || this.state.phase === "done") return;
    this.endingStartMs = Date.now();
    this.setState({ phase: "ending", endMode: mode });
    if (mode === "win") {
      const spawnBurst = () => {
        const mechColors = ["#9aa0a6", "#c7ccd1", "#5b6167", "#e8b23d"];
        const bloodColors = ["#8b0000", "#c0392b", "#5e0f0f", "#e74c3c"];
        const particles = [];
        for (let i = 0; i < 46; i++) {
          const useBlood = i % 2 === 0;
          const palette = useBlood ? bloodColors : mechColors;
          const color = palette[Math.floor(Math.random() * palette.length)];
          const angle = Math.random() * Math.PI * 2;
          const dist = 50 + Math.random() * 220;
          const dx = Math.cos(angle) * dist;
          const dy = Math.sin(angle) * dist * 0.6 + 80;
          const rot = Math.random() * 720 - 360;
          const size = useBlood ? 2 + Math.random() * 5 : 3 + Math.random() * 7;
          const shape = useBlood ? "50%" : (Math.random() < 0.5 ? "2px" : "50%");
          const delay = (Math.random() * 0.18).toFixed(2);
          particles.push({
            id: `${this.time}-${Math.random()}`,
            pstyle: `--dx:${dx.toFixed(0)}px;--dy:${dy.toFixed(0)}px;--rot:${rot.toFixed(0)}deg;position:absolute;left:50%;top:24%;width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;background:${color};border-radius:${shape};box-shadow:0 0 6px ${color};animation:death-particle-fly 0.95s cubic-bezier(0.2,0.7,0.3,1) ${delay}s forwards;pointer-events:none;`,
          });
        }
        this.setState(s => ({ deathParticles: [...s.deathParticles, ...particles] }));
        setTimeout(() => {
          const ids = new Set(particles.map(p => p.id));
          this.setState(s => ({ deathParticles: s.deathParticles.filter(p => !ids.has(p.id)) }));
        }, 1100);
      };
      [1200, 2400, 3600, 4800, 6000].forEach(delay => setTimeout(spawnBurst, delay));
      setTimeout(() => this.setState({ win: true, phase: "done" }), 7000);
    } else {
      setTimeout(() => this.setState({ gameOver: true, phase: "done" }), 4200);
    }
  }

  componentWillUnmount() {
    if (this._interval) clearInterval(this._interval);
    window.removeEventListener("resize", this._resizeHandler);
    window.removeEventListener("pointermove", this._mouseHandler);
    clearTimeout(this._introTimer);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.beads > this.state.beads && this.state.beads >= 0) {
      const step = 14;
      const removed = [];
      for (let i = this.state.beads; i < prevState.beads; i++) {
        removed.push({ id: `${this.time}-${i}`, x: i * step });
      }
      if (removed.length) {
        this.setState(s => ({ burningPips: [...s.burningPips, ...removed] }));
        setTimeout(() => {
          const ids = new Set(removed.map(r => r.id));
          this.setState(s => ({ burningPips: s.burningPips.filter(p => !ids.has(p.id)) }));
        }, 550);
      }
    }
  }

  buildPegs() {
    const rows = 10;
    const rowGap = (this.playBottom - this.playTop - 60) / rows;
    const pegs = [];
    for (let r = 0; r < rows; r++) {
      const y = this.playTop + 30 + r * rowGap;
      const cols = r % 2 === 0 ? 8 : 7;
      const usableW = this.playRight - this.playLeft - 16;
      const spacing = usableW / (cols - 1 + (r % 2 === 0 ? 0 : 1));
      const offset = r % 2 === 0 ? 8 : 8 + spacing / 2;
      for (let c = 0; c < cols; c++) {
        const x = this.playLeft + offset + c * spacing;
        if (x < this.playLeft + 6 || x > this.playRight - 6) continue;
        const mover = (c + r) % 5 === 0;
        pegs.push({ x, baseX: x, y, r: 3.6, hit: 0, mover, phase: Math.random() * Math.PI * 2, lastRow: r === rows - 1, bounceRow: r % 2 === 1 });
      }
    }
    this.pegs = pegs;
  }

  resize() {
    const canvas = this.boardCanvas;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.scaleFactor = rect.width / this.DESIGN_W;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr * this.scaleFactor, 0, 0, dpr * this.scaleFactor, 0, 0);
    this.boardCtx = ctx;
  }

  setRootRef = (el) => { this.rootEl = el; };
  setBoardRef = (el) => { this.boardCanvas = el; if (el) this.resize(); };
  setFireLeftRef = (el) => { this.fireLeftCanvas = el; };
  setFireRightRef = (el) => { this.fireRightCanvas = el; };
  setLeftHandRef = (el) => { this.leftHandEl = el; };
  setRightHandRef = (el) => { this.rightHandEl = el; };
  setBackLeftHandRef = (el) => { this.backLeftHandEl = el; };
  setBackRightHandRef = (el) => { this.backRightHandEl = el; };
  setHeadTiltRef = (el) => { this.headTiltEl = el; };
  setTermBgRef = (el) => { this.termBgCanvas = el; };
  setDarkenRef = (el) => { this.darkenEl = el; };
  setHeadImgRef = (el) => { this.headImgEl = el; };
  setMainLeftHandRef = (el) => { this.mainLeftHandEl = el; };
  setMainRightHandRef = (el) => { this.mainRightHandEl = el; };
  setChestImgRef = (el) => { this.chestImgEl = el; };
  setCrtGlitchRef = (el) => { this.crtGlitchEl = el; };

  handlePointerDown = (e) => {
    if (this.state.activeCard || this.state.gameOver || this.state.win || this.state.beads <= 0 || this.state.phase !== "play") return;
    const canvas = this.boardCanvas;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = rect.width / this.DESIGN_W;
    let x = (e.clientX - rect.left) / scale;
    x = clamp(x, this.playLeft + 6, this.playRight - 6);
    this.balls.push({ x, y: 16, vx: (Math.random() - 0.5) * 0.6, vy: 0, r: 5.2, hits: 0, pegHits: 0, settled: false });
    this.setState({ beads: this.state.beads - 1, message: "bead released // descending through the lattice" });
  };

  spawnParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const phi = Math.random() * Math.PI * 2;
      const v = 1 + Math.random() * 2.5;
      this.particles.push({ x, y, vx: Math.cos(phi) * v, vy: Math.sin(phi) * v - 1.2, color, size: 1.5 + Math.random() * 2, alpha: 1, life: 24 + Math.random() * 20 });
    }
  }

  onBeadLanded(gateIdx, ball) {
    const gate = this.gates[gateIdx];
    if (ball.pegHits <= 2) {
      this.spawnParticles(ball.x, this.playBottom, "#ffffff", 10);
      this.setState({ beads: this.state.beads + 1, message: "bead returned // too few resonances to bind" });
      return;
    }
    this.spawnParticles(ball.x, this.playBottom, gate.color, 16);
    this.triggerExplosion(0.5);
    if (this.state.activeCard || this.state.gameOver || this.state.win) return;
    let pool = DECK;
    const drawnNames = this.state.drawnCards.map((c) => c.name);
    if (gate.label === "CUPS") pool = DECK.filter((c) => c.tradition === "water");
    else if (gate.label === "WANDS") pool = DECK.filter((c) => c.tradition === "fire");
    else if (gate.label === "EARTH") pool = DECK.filter((c) => c.tradition === "earth");
    else if (gate.label === "AIR") pool = DECK.filter((c) => c.tradition === "air");
    else if (gate.label === "COSMOS") pool = DECK.filter((c) => c.major);
    let available = pool.filter((c) => !drawnNames.includes(c.name));
    if (available.length === 0) available = DECK.filter((c) => !drawnNames.includes(c.name));
    if (available.length === 0) available = DECK;
    const picked = available[Math.floor(Math.random() * available.length)];
    const reversed = Math.random() < 0.4;
    this.setState({
      activeCard: { ...picked, reversed },
      revealedActive: false,
      flyState: "idle",
      message: `landed: gate of ${gate.label.toLowerCase()} // click the card to unravel it`,
    });
  }

  evaluateCardEffect(card) {
    const name = card.name.toLowerCase();
    const roll = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
    const isFireAir = card.tradition === "fire" || card.tradition === "air";
    const isWaterEarth = card.tradition === "water" || card.tradition === "earth";
    const isMajorCurse = name.includes("tower") || name.includes("devil") || name.includes("death");
    const isMajorBoon = name.includes("sun") || name.includes("star") || name.includes("world") || name.includes("fortune");
    let effectType = "neutral", beadChange = 0, message = "";
    if (isMajorCurse) { effectType = "curse"; beadChange = -roll(3, 5); message = `curse: catastrophic interference (${beadChange})`; }
    else if (isMajorBoon) { effectType = "buff"; beadChange = roll(3, 5); message = `buff: cosmic alignment (+${beadChange})`; }
    else if (card.reversed && isFireAir) { effectType = "curse"; beadChange = -roll(2, 3); message = `curse: elemental backlash (${beadChange})`; }
    else if (card.reversed) { effectType = "curse"; beadChange = -roll(1, 2); message = `curse: channels reversed (${beadChange})`; }
    else if (isFireAir) {
      if (Math.random() < 0.5) { effectType = "curse"; beadChange = -roll(1, 2); message = `curse: elemental strife (${beadChange})`; }
      else { effectType = "buff"; beadChange = roll(1, 3); message = `buff: instant flux (+${beadChange})`; }
    } else if (isWaterEarth) { effectType = "buff"; beadChange = roll(1, 3); message = `buff: flow sustained (+${beadChange})`; }
    else { effectType = "buff"; beadChange = roll(1, 2); message = `buff: resonance harmonized (+${beadChange})`; }
    return { effectType, beadChange, message };
  }

  handleUnravel = () => {
    if (this.state.revealedActive || !this.state.activeCard) return;
    const card = this.state.activeCard;
    const { effectType, beadChange, message } = this.evaluateCardEffect(card);
    const big = Math.abs(beadChange) >= 4;
    this.flareBoost = big ? 1.6 : 1.0;
    this.triggerExplosion(big ? 1 : 0.75);
    const newScore = this.state.score + Math.max(0, beadChange) * 10 + 25;
    this.setState({
      revealedActive: true,
      score: newScore,
      beads: Math.max(0, this.state.beads + beadChange),
      message: `drew ${card.name.toLowerCase()} // ${message}`,
      eyeMode: effectType === "curse" ? "curse" : "buff",
      shaking: effectType === "curse",
      handHit: beadChange < 0,
    });
    if (!this.state.win && newScore >= 1000) this.beginEnding("win");
    setTimeout(() => this.setState({ shaking: false }), 500);
    if (beadChange < 0) setTimeout(() => this.setState({ handHit: false }), 600);
    setTimeout(() => {
      this.setState({ flyState: "flying" });
      setTimeout(() => {
        const drawn = [...this.state.drawnCards, { ...card, dimColor: effectType === "curse" ? "#c0392b" : "#cfc9c0" }];
        const nowBeads = this.state.beads;
        this.setState({
          drawnCards: drawn,
          activeCard: null,
          revealedActive: false,
          flyState: "none",
          eyeMode: "normal",
          message: nowBeads <= 0 ? "the conduit runs dry" : "the lattice awaits // tap to drop another bead",
        });
        if (!this.state.win && nowBeads <= 0) this.beginEnding("lose");
      }, 650);
    }, 1400);
  };

  handleRestartClick = () => {
    if (this.state.restarting) return;
    this.setState({ restarting: true });
    setTimeout(() => this.restart(), 340);
  };

  restart = () => {
    this.balls = [];
    this.particles = [];
    this.flareBoost = 0;
    if (this.sceneEl) { this.sceneEl.style.transform = ""; this.sceneEl.style.opacity = ""; }
    if (this.boardCanvas) { this.boardCanvas.style.opacity = ""; this.boardCanvas.style.filter = ""; }
    if (this.darkenEl) { this.darkenEl.style.opacity = "0"; this.darkenEl.style.background = "#000"; }
    if (this.mainLeftHandEl) this.mainLeftHandEl.style.transform = "";
    if (this.mainRightHandEl) this.mainRightHandEl.style.transform = "";
    this.setState({
      beads: (this.props && this.props.startingBeads) || 5,
      score: 0,
      message: "sacred conduit primed // tap the board to drop a bead",
      drawnCards: [],
      activeCard: null,
      revealedActive: false,
      flyState: "none",
      gameOver: false,
      win: false,
      restarting: false,
      eyeMode: "normal",
      shaking: false,
      phase: "play",
      endMode: null,
      deathParticles: [],
    });
  };

  tickPhysics() {
    const GRAVITY = 0.52, RESTITUTION = 0.58, FRICTION = 0.993;

    for (const peg of this.pegs) {
      if (peg.mover) peg.x = peg.baseX + Math.sin(this.time * 0.03 + peg.phase) * 6;
    }

    for (let i = this.balls.length - 1; i >= 0; i--) {
      const b = this.balls[i];
      if (b.settled) { this.balls.splice(i, 1); continue; }
      b.squish = (b.squish || 0) * 0.82;
      b.vy += GRAVITY; b.vx *= FRICTION; b.vy *= FRICTION;
      b.vx += this.boardTilt * 0.012; // tilt adds a gravity component sideways
      b.vx += (Math.random() - 0.5) * 0.05; // turbulence: no bead falls in a perfectly straight line
      b.x += b.vx; b.y += b.vy;
      if (b.x - b.r < this.playLeft) { b.x = this.playLeft + b.r; b.vx = Math.abs(b.vx) * RESTITUTION * 4.5 + 3.5; b.vy -= 2.2 + Math.random() * 1.4; b.hits++; b.squish = 2; }
      if (b.x + b.r > this.playRight) { b.x = this.playRight - b.r; b.vx = -(Math.abs(b.vx) * RESTITUTION * 4.5 + 3.5); b.vy -= 2.2 + Math.random() * 1.4; b.hits++; b.squish = 2; }
      for (const peg of this.pegs) {
        const dx = b.x - peg.x, dy = b.y - peg.y;
        const minDist = b.r + peg.r, distSq = dx * dx + dy * dy;
        if (distSq < minDist * minDist && distSq > 0.0001) {
          const dist = Math.sqrt(distSq), nx = dx / dist, ny = dy / dist;
          const overlap = minDist - dist;
          b.x += nx * overlap; b.y += ny * overlap;
          const dot = b.vx * nx + b.vy * ny;
          const rest = peg.lastRow ? RESTITUTION * 2.6 : RESTITUTION;
          b.vx = (b.vx - 2 * dot * nx) * rest;
          b.vy = (b.vy - 2 * dot * ny) * rest;
          if (peg.lastRow) {
            b.vx += (Math.random() - 0.5) * 3.2;
            b.vy -= Math.random() * 1.8;
            peg.hit = 1.6;
          } else if (peg.bounceRow) {
            b.vx += (Math.random() - 0.5) * 0.35;
            b.vy -= 1.2 + Math.random() * 2.6;
            peg.hit = 1.3;
          } else {
            b.vx += (Math.random() - 0.5) * 0.35;
            peg.hit = 1;
          }
          b.hits++; b.pegHits++;
          b.squish = peg.lastRow ? 2.2 : 1.5;
          if (b.hits % 3 === 0) {
            const pegScore = this.state.score + 5;
            this.setState({ score: pegScore });
            if (!this.state.win && pegScore >= 1000) this.beginEnding("win");
          }
        }
      }
      if (b.y > this.playBottom) {
        b.settled = true;
        const usable = this.playRight - this.playLeft;
        const gw = usable / this.gates.length;
        let idx = Math.floor((b.x - this.playLeft) / gw);
        idx = clamp(idx, 0, this.gates.length - 1);
        this.onBeadLanded(idx, b);
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life--; p.alpha = Math.max(0, p.life / 40);
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  drawBoard() {
    const ctx = this.boardCtx;
    if (!ctx) return;
    const W = this.DESIGN_W, H = this.DESIGN_H;
    ctx.clearRect(0, 0, W, H);
    for (const peg of this.pegs) {
      peg.hit *= 0.9;
      ctx.beginPath();
      ctx.arc(peg.x, peg.y, peg.r + peg.hit * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, 0.75 + peg.hit * 0.6)})`;
      ctx.shadowColor = `rgba(255,255,255,${0.9 + peg.hit * 0.1})`;
      ctx.shadowBlur = 10 + peg.hit * 14;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    const usable = this.playRight - this.playLeft;
    const gw = usable / this.gates.length;
    ctx.font = "8px ui-monospace, monospace";
    ctx.textAlign = "center";
    for (let i = 0; i < this.gates.length; i++) {
      const gate = this.gates[i];
      const gx = this.playLeft + i * gw;
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath(); ctx.moveTo(gx, this.playBottom); ctx.lineTo(gx, this.playBottom + 40); ctx.stroke();
      ctx.save();
      ctx.font = "20px ui-monospace, monospace";
      ctx.fillStyle = gate.color;
      ctx.shadowColor = gate.color;
      ctx.shadowBlur = 14;
      ctx.globalAlpha = 0.95;
      ctx.fillText(gate.symbol, gx + gw / 2, this.playBottom + 24);
      ctx.restore();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath(); ctx.moveTo(this.playRight, this.playBottom); ctx.lineTo(this.playRight, this.playBottom + 40); ctx.stroke();
    for (const b of this.balls) {
      const squish = b.squish || 0;
      const speed = Math.min(1, Math.hypot(b.vx, b.vy) / 8);
      const sx = 1 + squish * 0.35 - speed * 0.08;
      const sy = 1 - squish * 0.25 + speed * 0.08;
      const pulse = 0.85 + Math.sin(this.time * 0.15 + b.x * 0.05) * 0.15;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.scale(sx, sy);
      ctx.beginPath();
      ctx.arc(0, 0, b.r + speed * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#e3d9c6";
      ctx.shadowColor = `rgba(255,214,120,${0.7 * pulse + speed * 0.3})`;
      ctx.shadowBlur = 16 + speed * 14 + squish * 10;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-b.r * 0.3, -b.r * 0.3, b.r * 0.4, 0, Math.PI * 2);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fill();
      ctx.restore();
    }
    for (const p of this.particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      ctx.globalAlpha = 1;
    }
  }

  drawFire(canvas, buf, palette, ash, embers, ditherAmt, ditherOffset) {
    if (!canvas) return;
    const ctx = canvas.__ctx || (canvas.__ctx = canvas.getContext("2d"));
    ctx.clearRect(0, 0, this.FW, this.FH);
    for (let y = 0; y < this.FH; y++) {
      for (let x = 0; x < this.FW; x++) {
        const v = buf[y * this.FW + x];
        if (v <= 0) continue;
        if (ditherAmt > 0.01) {
          const bayerVal = BAYER4[(y + ditherOffset) % 4][(x + ditherOffset) % 4] / 16;
          if (bayerVal < ditherAmt * 0.6) continue;
        }
        const rLocal = y - this.SKY_ROWS;
        const rowT = clamp(rLocal / (this.FLAME_ROWS - 1), 0, 1);
        ctx.globalAlpha = lerp(0.45, 1, rowT); // heat-shimmer: the tip reads thinner/hazier than the base
        ctx.fillStyle = palette[v];
        ctx.fillRect(x, y, 1, 1);
        ctx.globalAlpha = 1;
      }
    }
    for (const p of ash) {
      ctx.globalAlpha = p.alpha * 0.8;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
    }
    for (const p of embers) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      if (p.glyph) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.font = "3px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.glyph, 0, 0);
        ctx.restore();
      } else {
        ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
      }
    }
    ctx.globalAlpha = 1;
  }

  spawnAsh(mid) {
    const side = Math.random() < 0.5 ? -1 : 1;
    return { x: mid + (Math.random() - 0.5) * 2, y: this.SKY_ROWS + Math.random() * 6, vx: side * (0.12 + Math.random() * 0.35), vy: -0.06 - Math.random() * 0.1, life: 34 + Math.random() * 26, maxLife: 60, alpha: 1, color: ["#3a3a3a", "#555555", "#6b6b6b"][Math.floor(Math.random() * 3)] };
  }
  spawnEmber(mid, colors) {
    const side = Math.random() < 0.5 ? -1 : 1;
    return { x: mid + (Math.random() - 0.5) * 1.4, y: this.SKY_ROWS + Math.random() * 5, vx: side * (0.15 + Math.random() * 0.45), vy: -0.08 - Math.random() * 0.12, life: 18 + Math.random() * 16, maxLife: 34, alpha: 1, color: colors[Math.floor(Math.random() * colors.length)] };
  }
  spawnMidEmber(mid, colors) {
    const midRow = this.SKY_ROWS + this.FLAME_ROWS * (0.45 + Math.random() * 0.3);
    return { x: mid + (Math.random() - 0.5) * 3, y: midRow, vx: (Math.random() - 0.5) * 0.18, vy: -0.18 - Math.random() * 0.22, life: 14 + Math.random() * 14, maxLife: 28, alpha: 1, color: colors[Math.floor(Math.random() * colors.length)] };
  }
  spawnBurstParticle(mid, midRow, colors) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.55 + Math.random() * 1.1;
    return { x: mid, y: midRow, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 16 + Math.random() * 16, maxLife: 30, alpha: 1, color: colors[Math.floor(Math.random() * colors.length)] };
  }
  spawnAshBurst(mid, midRow) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.25 + Math.random() * 0.6;
    return { x: mid, y: midRow, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 30 + Math.random() * 30, maxLife: 58, alpha: 1, color: ["#3a3a3a", "#555555", "#6b6b6b", "#8a8a8a"][Math.floor(Math.random() * 4)] };
  }
  spawnGlyphParticle(mid, midRow, colors) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.16 + Math.random() * 0.24;
    const glyph = KABBALIST_GLYPHS[Math.floor(Math.random() * KABBALIST_GLYPHS.length)];
    return { x: mid, y: midRow, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 0.05, life: 26 + Math.random() * 20, maxLife: 46, alpha: 1, rot: Math.random() * Math.PI * 2, vrot: (Math.random() - 0.5) * 0.3, glyph, color: colors[Math.floor(Math.random() * colors.length)] };
  }
  triggerExplosion(strength) {
    this.explodeTimer = Math.max(this.explodeTimer, strength);
    const mid = (this.FW - 1) / 2;
    const midRow = this.SKY_ROWS + this.FLAME_ROWS * 0.55;
    const palette = PALETTES[this.state.eyeMode] || PALETTES.fire;
    const colors = [palette[38], palette[32], palette[26], palette[20]];
    const count = Math.round(24 + strength * 40);
    for (let i = 0; i < count; i++) {
      this.emberL.push(this.spawnBurstParticle(mid, midRow, colors));
      this.emberR.push(this.spawnBurstParticle(mid, midRow, colors));
    }
    const ashCount = Math.round(14 + strength * 22);
    for (let i = 0; i < ashCount; i++) {
      this.ashL.push(this.spawnAshBurst(mid, midRow));
      this.ashR.push(this.spawnAshBurst(mid, midRow));
    }
    const glyphCount = Math.round(2 + strength * 4);
    for (let i = 0; i < glyphCount; i++) {
      this.emberL.push(this.spawnGlyphParticle(mid, midRow, colors));
      this.emberR.push(this.spawnGlyphParticle(mid, midRow, colors));
    }
  }

  tick() {
    this.time += 1;

    this.boardTiltTimer -= 1;
    if (this.boardTiltTimer <= 0) {
      this.boardTiltTarget = (Math.random() - 0.5) * 16;
      this.boardTiltTimer = 260 + Math.random() * 260;
    }
    this.boardTilt = lerp(this.boardTilt, this.boardTiltTarget, 0.015);

    this.headShakeTimer -= 1;
    if (this.headShakeTimer <= 0) {
      this.headTiltPulse = 1;
      this.headShakeTimer = 280 + Math.random() * 380;
    }
    this.headTiltPulse *= 0.9;

    this.tickPhysics();
    this.drawBoard();

    const cap = (this.props && this.props.flameCapBeads) || 12;
    const gameOver = this.state.gameOver;
    this.flareBoost *= 0.9;
    const baseT = gameOver ? 0 : clamp(this.state.beads / cap, 0, 1);
    const effT = gameOver ? 0 : clamp(baseT + this.flareBoost * 0.55, 0, 1.35);
    const sourceVal = gameOver ? 0 : Math.round(lerp(16, 39, Math.min(1, effT)));
    const mid = (this.FW - 1) / 2;
    const palette = PALETTES[this.state.eyeMode] || PALETTES.fire;
    const emberColors = [palette[38], palette[32], palette[26]];

    this.fireFrameSkip = (this.fireFrameSkip + 1) % 4;
    if (this.fireFrameSkip === 0) {
      buildFlameBuffer(this.fireBufL, this.FW, this.FH, this.FLAME_ROWS, this.SKY_ROWS, sourceVal, this.time * 0.09);
      buildFlameBuffer(this.fireBufR, this.FW, this.FH, this.FLAME_ROWS, this.SKY_ROWS, sourceVal, this.time * 0.11 + 2.1);
    }

    const ashChance = sourceVal > 0 ? 0.1 : 0;
    const emberChance = sourceVal > 0 ? 0.22 * (0.3 + effT) : 0;
    updateParticles(this.ashL, () => this.spawnAsh(mid), ashChance);
    updateParticles(this.ashR, () => this.spawnAsh(mid), ashChance);
    updateParticles(this.emberL, () => this.spawnEmber(mid, emberColors), emberChance);
    updateParticles(this.emberR, () => this.spawnEmber(mid, emberColors), emberChance);
    updateParticles(this.emberL, () => this.spawnMidEmber(mid, emberColors), sourceVal > 0 ? 0.14 : 0);
    updateParticles(this.emberR, () => this.spawnMidEmber(mid, emberColors), sourceVal > 0 ? 0.14 : 0);

    this.explodeTimer = Math.max(0, this.explodeTimer - 0.045);
    this.drawFire(this.fireLeftCanvas, this.fireBufL, palette, this.ashL, this.emberL, this.explodeTimer, this.time);
    this.drawFire(this.fireRightCanvas, this.fireBufR, palette, this.ashR, this.emberR, this.explodeTimer, this.time + 2);

    const activeCount = this.balls.length;
    const base = activeCount > 0 ? 2.5 : 0;
    const hs = this.handState;
    hs.fl = lerp(hs.fl, base + Math.sin(this.time * 0.05) * 3.5, 0.08);
    hs.fr = lerp(hs.fr, base * 0.9 + Math.sin(this.time * 0.045 + 1.3) * 4, 0.07);
    hs.bl = lerp(hs.bl, base * 1.2 + Math.sin(this.time * 0.032 + 2.1) * 5.25, 0.05);
    hs.br = lerp(hs.br, base * 1.1 + Math.sin(this.time * 0.038 + 3.4) * 4.75, 0.06);
    if (this.leftHandEl) this.leftHandEl.style.transform = `translateY(${hs.fl}px) rotate(${Math.sin(this.time * 0.045) * 2}deg)`;
    if (this.rightHandEl) this.rightHandEl.style.transform = `translateY(${hs.fr}px) rotate(${Math.sin(this.time * 0.04 + 2) * -2}deg)`;
    if (this.backLeftHandEl) this.backLeftHandEl.style.transform = `translateY(${hs.bl}px) rotate(${Math.sin(this.time * 0.028 + 1) * 2.5}deg)`;
    if (this.backRightHandEl) this.backRightHandEl.style.transform = `translateY(${hs.br}px) rotate(${Math.sin(this.time * 0.033 + 3) * -2.5}deg)`;
    if (this.state.phase === "ending" && this.state.endMode === "lose") {
      const rt = clamp((Date.now() - (this.endingStartMs || Date.now())) / 4200, 0, 1);
      const reach = Math.pow(rt, 0.7);
      const outY = -reach * 110;
      const outScale = 1 + reach * 0.65;
      const grasp = Math.sin(this.time * 0.35 + reach * 2) * 2.2 * reach;
      if (this.mainLeftHandEl) this.mainLeftHandEl.style.transform = `translateY(${outY.toFixed(1)}px) scale(${outScale.toFixed(2)}) rotate(${(-6 - grasp).toFixed(1)}deg)`;
      if (this.mainRightHandEl) this.mainRightHandEl.style.transform = `translateY(${outY.toFixed(1)}px) scale(${outScale.toFixed(2)}) rotate(${(6 + grasp).toFixed(1)}deg)`;
    } else if (this.state.phase === "play") {
      const idleY = Math.sin(this.time * 0.02) * 4;
      if (this.mainLeftHandEl) this.mainLeftHandEl.style.transform = `translateY(${idleY.toFixed(1)}px) rotate(${(Math.sin(this.time * 0.018) * 2).toFixed(1)}deg)`;
      if (this.mainRightHandEl) this.mainRightHandEl.style.transform = `translateY(${(-idleY).toFixed(1)}px) rotate(${(Math.sin(this.time * 0.018 + 1) * -2).toFixed(1)}deg)`;
    }

    if (this.boardCanvas) this.boardCanvas.style.transform = `rotate(${this.boardTilt}deg)`;
    if (this.headTiltEl) {
      if (this.state.phase === "ending" && this.state.endMode === "win") {
        const t = clamp((Date.now() - (this.endingStartMs || Date.now())) / 7000, 0, 1);
        const tiltDeg = Math.min(92, (t / 0.3) * 92);
        const shakeAmt = (1 - Math.min(1, t / 0.3)) * 18;
        const jitterX = Math.sin(this.time * 3.3) * shakeAmt;
        const jitterY = Math.cos(this.time * 3.9) * shakeAmt * 0.6;
        this.headTiltEl.style.transform = `translateX(-50%) translate(${jitterX}px, ${jitterY}px) rotate(${tiltDeg}deg)`;
      } else if (this.state.phase === "ending" && this.state.endMode === "lose") {
        const t = clamp((Date.now() - (this.endingStartMs || Date.now())) / 4200, 0, 1);
        const shakeAmt = 3 + t * 16;
        const jitterX = Math.sin(this.time * (3 + t * 4)) * shakeAmt;
        const jitterY = Math.cos(this.time * (3.4 + t * 4)) * shakeAmt * 0.5;
        const glare = Math.sin(this.time * 1.4) * 3;
        this.headTiltEl.style.transform = `translateX(-50%) translate(${jitterX}px, ${jitterY}px) rotate(${glare}deg)`;
      } else {
        const redness = this.state.gameOver ? 0 : this.state.win ? 1 : clamp(this.state.score / 1000, 0, 1);
        const violence = redness * redness;
        const headTiltAngle = Math.sin(this.time * 0.9) * this.headTiltPulse * 12 + Math.sin(this.time * 2.1) * violence * 9;
        const jitterX = Math.sin(this.time * 3.3) * violence * 9;
        const jitterY = Math.cos(this.time * 3.9) * violence * 6;
        this.headTiltEl.style.transform = `translateX(-50%) translate(${jitterX}px, ${jitterY}px) rotate(${headTiltAngle}deg)`;
      }
    }
    if (this.headImgEl) {
      if (this.state.phase === "ending" && this.state.endMode === "lose") {
        const t = clamp((Date.now() - (this.endingStartMs || Date.now())) / 4200, 0, 1);
        this.headImgEl.style.filter = `sepia(0.7) hue-rotate(-24deg) saturate(${(1 + t * 2.8).toFixed(2)}) brightness(${(1 - t * 0.35).toFixed(2)}) contrast(${(1 + t * 0.5).toFixed(2)}) drop-shadow(0 0 ${(t * 36).toFixed(0)}px rgba(180,10,10,${(t * 0.95).toFixed(2)}))`;
      } else if (this.state.phase === "ending" && this.state.endMode === "win") {
        const t = clamp((Date.now() - (this.endingStartMs || Date.now())) / 7000, 0, 1);
        const r = Math.min(1, t / 0.3);
        this.headImgEl.style.filter = `sepia(0.9) hue-rotate(-32deg) saturate(${(1 + r * 2.4).toFixed(2)}) brightness(${(1 - r * 0.15).toFixed(2)}) drop-shadow(0 0 ${(r * 30).toFixed(0)}px rgba(210,20,20,${(r * 0.9).toFixed(2)}))`;
      } else {
        this.headImgEl.style.filter = "";
      }
    }
    if (this.state.phase === "ending" && this.state.endMode === "win") {
      const t = clamp((Date.now() - (this.endingStartMs || Date.now())) / 7000, 0, 1);
      const r = Math.min(1, t / 0.3);
      const winFilter = `sepia(0.9) hue-rotate(-32deg) saturate(${(1 + r * 2.4).toFixed(2)}) brightness(${(1 - r * 0.15).toFixed(2)}) drop-shadow(0 0 ${(r * 30).toFixed(0)}px rgba(210,20,20,${(r * 0.9).toFixed(2)}))`;
      [this.chestImgEl, this.leftHandEl, this.rightHandEl, this.backLeftHandEl, this.backRightHandEl, this.mainLeftHandEl, this.mainRightHandEl].forEach(el => { if (el) el.style.filter = winFilter; });
    } else if (this.state.phase !== "ending" || this.state.endMode !== "lose") {
      [this.chestImgEl, this.leftHandEl, this.rightHandEl, this.backLeftHandEl, this.backRightHandEl, this.mainLeftHandEl, this.mainRightHandEl].forEach(el => { if (el) el.style.filter = ""; });
    }
    if (this.state.phase === "ending" && this.state.endMode === "win" && this.sceneEl) {
      const t = clamp((Date.now() - (this.endingStartMs || Date.now())) / 7000, 0, 1);
      const fallY = Math.pow(Math.max(0, (t - 0.08) / 0.92), 2.1) * 360;
      const fadeOut = t > 0.88 ? clamp(1 - (t - 0.88) / 0.12, 0, 1) : 1;
      this.sceneEl.style.transform = `translateY(${fallY.toFixed(1)}px)`;
      this.sceneEl.style.opacity = fadeOut.toFixed(2);
      if (this.mainLeftHandEl) { this.mainLeftHandEl.style.transform = `translateY(${fallY.toFixed(1)}px)`; this.mainLeftHandEl.style.opacity = fadeOut.toFixed(2); }
      if (this.mainRightHandEl) { this.mainRightHandEl.style.transform = `translateY(${fallY.toFixed(1)}px)`; this.mainRightHandEl.style.opacity = fadeOut.toFixed(2); }
    }
    if (this.state.phase === "ending" && this.state.endMode === "lose") {
      const t = clamp((Date.now() - (this.endingStartMs || Date.now())) / 4200, 0, 1);
      if (this.sceneEl) {
        const scale = 1 + t * 0.55;
        const riseY = -t * 60;
        this.sceneEl.style.transform = `translateY(${riseY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        this.sceneEl.style.opacity = "1";
      }
      const breakT = clamp(t / 0.12, 0, 1);
      if (this.boardCanvas) {
        const shake = (1 - breakT) * 14;
        const jx = Math.sin(this.time * 9) * shake;
        const jy = Math.cos(this.time * 11) * shake * 0.6;
        this.boardCanvas.style.transform = breakT < 1 ? `rotate(${this.boardTilt}deg) translate(${jx.toFixed(1)}px, ${jy.toFixed(1)}px) scale(${(1 + (1 - breakT) * 0.06).toFixed(3)})` : `rotate(${this.boardTilt}deg)`;
        this.boardCanvas.style.opacity = String(Math.max(0, 1 - breakT * breakT));
        this.boardCanvas.style.filter = breakT < 1 ? `contrast(${(1 + (1 - breakT) * 2.2).toFixed(2)}) brightness(${(1 - (1 - breakT) * 0.3).toFixed(2)})` : "none";
      }
      const redT = t < 0.35 ? 0 : clamp((t - 0.35) / 0.65, 0, 1);
      if (this.darkenEl) { this.darkenEl.style.opacity = String(redT * 0.92); this.darkenEl.style.background = "radial-gradient(circle, rgba(120,10,10,0.9), rgba(30,0,0,0.98))"; }
    } else if (this.darkenEl && this.state.phase !== "done") {
      this.darkenEl.style.opacity = "0";
      this.darkenEl.style.background = "#000";
      if (this.boardCanvas && this.state.phase === "play") { this.boardCanvas.style.opacity = ""; this.boardCanvas.style.filter = ""; this.boardCanvas.style.transform = `rotate(${this.boardTilt}deg)`; }
    }
    if (this.beadRowEl) {
      const mx = (this.mouseNX || 0) * 6;
      const my = (this.mouseNY || 0) * 4;
      this._beadFollowX = lerp(this._beadFollowX || 0, mx, 0.08);
      this._beadFollowY = lerp(this._beadFollowY || 0, my, 0.08);
      this.beadRowEl.style.transform = `translate(${this._beadFollowX}px, ${this._beadFollowY}px)`;
    }
  }

  initTerminalGL() {
    const canvas = this.termBgCanvas;
    if (!canvas) return;
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;
    this.termGL = gl;
    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, FAULTY_TERMINAL_VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FAULTY_TERMINAL_FRAG);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);
    this.termProgram = prog;

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uvBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
    const uvLoc = gl.getAttribLocation(prog, "uv");
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

    const U = (n) => gl.getUniformLocation(prog, n);
    this.termUniforms = {
      iTime: U("iTime"), iResolution: U("iResolution"), uScale: U("uScale"),
      uGridMul: U("uGridMul"), uDigitSize: U("uDigitSize"), uScanlineIntensity: U("uScanlineIntensity"),
      uGlitchAmount: U("uGlitchAmount"), uFlickerAmount: U("uFlickerAmount"), uNoiseAmp: U("uNoiseAmp"),
      uChromaticAberration: U("uChromaticAberration"), uDither: U("uDither"), uCurvature: U("uCurvature"),
      uTint: U("uTint"), uMouse: U("uMouse"), uMouseStrength: U("uMouseStrength"), uUseMouse: U("uUseMouse"),
      uPageLoadProgress: U("uPageLoadProgress"), uUsePageLoadAnimation: U("uUsePageLoadAnimation"), uBrightness: U("uBrightness"),
    };
    this.termStartTime = performance.now();
    this.resizeTerminalGL();
  }

  resizeTerminalGL() {
    const canvas = this.termBgCanvas, gl = this.termGL;
    if (!canvas || !gl) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  renderTerminalFrame() {
    const gl = this.termGL;
    if (!gl || !this.termProgram) return;
    const u = this.termUniforms;
    const t = (performance.now() - this.termStartTime) * 0.001 * 0.5;
    gl.useProgram(this.termProgram);
    gl.uniform1f(u.iTime, t);
    gl.uniform3f(u.iResolution, gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
    gl.uniform1f(u.uScale, 1.5);
    gl.uniform2f(u.uGridMul, 2, 1);
    gl.uniform1f(u.uDigitSize, 1.2);
    gl.uniform1f(u.uScanlineIntensity, 2);
    gl.uniform1f(u.uGlitchAmount, 2.4);
    gl.uniform1f(u.uFlickerAmount, 1);
    gl.uniform1f(u.uNoiseAmp, 1);
    gl.uniform1f(u.uChromaticAberration, 0.45);
    gl.uniform1f(u.uDither, 0.55);
    gl.uniform1f(u.uCurvature, 0.5);
    gl.uniform3f(u.uTint, 28 / 255, 1, 0);
    gl.uniform2f(u.uMouse, 0.5, 0.5);
    gl.uniform1f(u.uMouseStrength, 0);
    gl.uniform1f(u.uUseMouse, 0);
    gl.uniform1f(u.uPageLoadProgress, 1);
    gl.uniform1f(u.uUsePageLoadAnimation, 0);
    gl.uniform1f(u.uBrightness, 0.02);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  getFlameScale() {
    const cap = (this.props && this.props.flameCapBeads) || 12;
    const baseT = this.state.gameOver ? 0 : clamp(this.state.beads / cap, 0, 1);
    const boosted = this.state.gameOver ? 0 : clamp(baseT + this.flareBoost * 0.35, 0, 1.25);
    return this.state.gameOver ? 0.05 : lerp(0.45, 1.35, boosted);
  }

  getFlameOpacity() {
    const cap = (this.props && this.props.flameCapBeads) || 12;
    const baseT = this.state.gameOver ? 0 : clamp(this.state.beads / cap, 0, 1);
    return this.state.gameOver ? 0 : lerp(0.25, 1, baseT);
  }

  renderVals() {
    const s = this.state;
    const card = s.activeCard;
    return {
      beads: s.beads,
      score: s.score,
      message: s.message,
      drawnCards: s.drawnCards,
      drawnCardsCount: s.drawnCards.length,
      beadPips: Array.from({ length: Math.max(0, s.beads) }),
      gameOver: s.gameOver,
      win: s.win,
      hasActiveCard: !!card,
      isRevealedActive: s.revealedActive,
      activeCardForDS: card ? { num: card.num, glyph: card.glyph, name: card.name.toUpperCase() } : { num: "", glyph: "", name: "" },
      activeCardReversed: !!(card && card.reversed),
      cardHint: !s.revealedActive ? "[ click to unravel ]" : "[ aligning bead flow... ]",
      cardTransform: s.flyState === "flying" ? "translate3d(0,50px,0) scale(0.03) rotate(35deg)" : "translate3d(0,0,0) scale(1) rotate(0deg)",
      cardEnterAnim: s.flyState === "flying" ? "none" : "card-enter-punch 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.2s both, card-idle-float 3.4s ease-in-out 0.75s infinite",
      gameOverAnim: s.restarting ? "gameover-out 0.34s ease forwards" : "gameover-bg-in 0.7s ease forwards",
      winAnim: s.restarting ? "gameover-out 0.34s ease forwards" : "win-bg-in 0.7s ease forwards",
      cardOpacity: s.flyState === "flying" ? 0 : 1,
      cardFilter: s.flyState === "flying" ? "blur(6px) brightness(0.2)" : "blur(0px) brightness(1)",
      skeleHandsOffset: s.flyState === "flying" ? "40px" : "0px",
      skeleHandsScale: s.flyState === "flying" ? "0.5" : "1",
      skeleHandsOpacity: s.flyState === "flying" ? "0" : "1",
      skeleHandsEnterAnim: s.flyState === "flying" ? "none" : "hands-enter 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      boardCursor: s.activeCard || s.gameOver || s.win || s.beads <= 0 || s.phase !== "play" ? "default" : "pointer",
      shakeAnimStyle: "none",
      skeletonFilter: (() => {
        if (s.phase === "ending" && s.endMode === "lose") {
          const t = clamp((Date.now() - (this.endingStartMs || Date.now())) / 4200, 0, 1);
          return `sepia(0.7) hue-rotate(-24deg) saturate(${(1 + t * 2.8).toFixed(2)}) brightness(${(1 - t * 0.35).toFixed(2)}) contrast(${(1 + t * 0.5).toFixed(2)}) drop-shadow(0 0 ${(t * 36).toFixed(0)}px rgba(180,10,10,${(t * 0.95).toFixed(2)}))`;
        }
        if (s.phase === "ending") {
          const t = clamp((Date.now() - (this.endingStartMs || Date.now())) / 7000, 0, 1);
          const r = Math.min(1, t / 0.3);
          return `sepia(0.9) hue-rotate(-32deg) saturate(${(1 + r * 2.4).toFixed(2)}) brightness(${(1 - r * 0.15).toFixed(2)}) drop-shadow(0 0 ${(r * 30).toFixed(0)}px rgba(210,20,20,${(r * 0.9).toFixed(2)}))`;
        }
        if (s.gameOver) return "grayscale(1) brightness(0.6)";
        const redness = s.win ? 1 : clamp(s.score / 1000, 0, 1);
        if (redness <= 0) return "none";
        return `sepia(${(redness * 0.8).toFixed(2)}) hue-rotate(${(-redness * 28).toFixed(1)}deg) saturate(${(1 + redness * 1.8).toFixed(2)}) brightness(${(1 + redness * 0.2).toFixed(2)}) drop-shadow(0 0 ${(redness * 24).toFixed(0)}px rgba(192,20,20,${(redness * 0.85).toFixed(2)}))`;
      })(),
      handFlashAnim: s.handHit ? "hand-cringe 0.6s ease-in-out" : "none",
      flameScale: s.phase === "ending" ? 0 : this.getFlameScale(),
      flameOpacity: s.phase === "ending" ? 0 : this.getFlameOpacity(),
      setRootRef: this.setRootRef,
      setBeadRowRef: (el) => { this.beadRowEl = el; },
      setSceneRef: (el) => { this.sceneEl = el; },
      previewIntro: this.previewIntro,
      previewLose: () => this.previewEnding("lose"),
      previewWin: () => this.previewEnding("win"),
      burningPips: s.burningPips,
      lowBeadsFlashAnim: (s.beads > 0 && s.beads <= 3) ? "bead-low-flash 0.6s ease-in-out infinite" : "none",
      scoreStyle: (() => {
        const t = clamp(s.score / 1000, 0, 1);
        const size = 38 + t * 22;
        const jitterAmt = t * t * 4;
        const jx = (Math.sin(this.time * 4.1) * jitterAmt).toFixed(1);
        const jy = (Math.cos(this.time * 3.7) * jitterAmt).toFixed(1);
        const col = t < 0.01 ? "#ffffff" : `rgb(${255}, ${Math.round(255 - t * 220)}, ${Math.round(255 - t * 220)})`;
        return `color:${col};font-size:${size}px;font-weight:800;line-height:1;letter-spacing:0.02em;transform:translate(${jx}px,${jy}px);text-shadow:0 0 ${(18 + t * 26)}px rgba(255,${Math.round(60 - t * 60)},${Math.round(60 - t * 60)},${(0.55 + t * 0.4).toFixed(2)}), 0 0 4px rgba(255,255,255,0.9);`;
      })(),
      setBoardRef: this.setBoardRef,
      sceneAnim: (() => {
        if (s.phase === "intro") return "scene-intro-rise 2.2s cubic-bezier(0.16,1,0.3,1) both";
        return "none";
      })(),
      handsDanceAnim: s.phase === "intro" ? "intro-dance-hands 1.1s ease-in-out infinite" : "none",
      handsDanceFLAnim: s.phase === "intro" ? "hands-appear 0.45s ease 0.9s both, intro-dance-fl 1.3s ease-in-out infinite 1.3s" : "none",
      handsDanceFRAnim: s.phase === "intro" ? "hands-appear 0.45s ease 1.0s both, intro-dance-fr 1.6s ease-in-out infinite 1.4s" : "none",
      handsDanceBLAnim: s.phase === "intro" ? "hands-appear 0.45s ease 0.85s both, intro-dance-bl 1.9s ease-in-out infinite 1.25s" : "none",
      handsDanceBRAnim: s.phase === "intro" ? "hands-appear 0.45s ease 0.95s both, intro-dance-br 1.5s ease-in-out infinite 1.35s" : "none",
      sigilsVisible: s.phase === "intro",
      sigilList: SIGIL_GLYPHS.map((g, i) => ({ g, left: SIGIL_POS[i].left, top: SIGIL_POS[i].top, delay: `${2.4 + i * 0.12}s` })),
      boardIntroStyle: s.phase === "intro" ? "opacity:0;transform:scale(0.85);animation:board-intro-in 0.5s ease 4.5s both;" : "opacity:1;transform:scale(1);",
      explodeFlashVisible: s.phase === "intro",
      deathParticles: s.deathParticles,
      setFireLeftRef: this.setFireLeftRef,
      setFireRightRef: this.setFireRightRef,
      setLeftHandRef: this.setLeftHandRef,
      setRightHandRef: this.setRightHandRef,
      setBackLeftHandRef: this.setBackLeftHandRef,
      setBackRightHandRef: this.setBackRightHandRef,
      setHeadTiltRef: this.setHeadTiltRef,
      setTermBgRef: this.setTermBgRef,
      setDarkenRef: this.setDarkenRef,
      setHeadImgRef: this.setHeadImgRef,
      setMainLeftHandRef: this.setMainLeftHandRef,
      setMainRightHandRef: this.setMainRightHandRef,
      setChestImgRef: this.setChestImgRef,
      mainHandsOpacity: 1,
      mainHandsIntroAnim: s.phase === "intro" ? "scene-intro-rise 2.2s cubic-bezier(0.16,1,0.3,1) both" : "none",
      handlePointerDown: this.handlePointerDown,
      handleUnravel: this.handleUnravel,
      restart: this.restart,
      handleRestartClick: this.handleRestartClick,
    };
  }
}