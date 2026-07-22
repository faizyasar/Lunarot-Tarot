declare const __BUILD_COMMIT_HASH__: string;
export interface Card {
  name: string;
  num: string;
  glyph: string;
  tradition: string;
}

export interface DrawnCard extends Card {
  reversed: boolean;
  broken: boolean;
  burning: boolean;
}

export interface NatalUser {
  sun: string;
  moon: string;
  rising: string | null;
  hasRising: boolean;
  name: string | null;
  sunIdx: number;
  moonIdx: number;
  risingIdx: number | null;
  jd: number;
}

export interface Planet {
  name: string;
  symbol: string;
  deg: number;
  sign: string;
  color: string;
}

export const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const ELEMENT_COLOR: Record<string, string> = {
  Aries: '#e05050',
  Taurus: '#80c860',
  Gemini: '#f0d060',
  Cancer: '#7ec8e3',
  Leo: '#f5c842',
  Virgo: '#b0e0b0',
  Libra: '#f0a0e0',
  Scorpio: '#c080a0',
  Sagittarius: '#ffd580',
  Capricorn: '#a08060',
  Aquarius: '#80e8ff',
  Pisces: '#8080ff'
};

export const DECK: Card[] = [
  { name: "The Fool", num: "0", glyph: "🜁", tradition: "The Leap of Faith" },
  { name: "The Magician", num: "I", glyph: "☿", tradition: "The Vessel" },
  { name: "The High Priestess", num: "II", glyph: "☽", tradition: "The Inner Sanctum" },
  { name: "The Empress", num: "III", glyph: "♀", tradition: "The Holy Mother" },
  { name: "The Emperor", num: "IV", glyph: "♂", tradition: "The Divine Law" },
  { name: "The Hierophant", num: "V", glyph: "♉", tradition: "The Initiated Teaching" },
  { name: "The Lovers", num: "VI", glyph: "♊", tradition: "The Holy Covenant" },
  { name: "The Chariot", num: "VII", glyph: "♋", tradition: "Merkabah Mysticism" },
  { name: "Strength", num: "VIII", glyph: "♌", tradition: "The Greater Jihad" },
  { name: "The Hermit", num: "IX", glyph: "⊕", tradition: "The Desert Fathers" },
  { name: "Wheel of Fortune", num: "X", glyph: "♃", tradition: "Divine Providence" },
  { name: "Justice", num: "XI", glyph: "♎", tradition: "The Final Reckoning" },
  { name: "The Hanged Man", num: "XII", glyph: "♆", tradition: "The Dark Night" },
  { name: "Death", num: "XIII", glyph: "♏", tradition: "Fanaa · Sufi Annihilation" },
  { name: "Temperance", num: "XIV", glyph: "♐", tradition: "Tikkun Olam" },
  { name: "The Devil", num: "XV", glyph: "♑", tradition: "Zoroastrian Shadow" },
  { name: "The Tower", num: "XVI", glyph: "🜂", tradition: "The Prophetic Strike" },
  { name: "The Star", num: "XVII", glyph: "★", tradition: "Ahura Mazda's Light" },
  { name: "The Moon", num: "XVIII", glyph: "☾", tradition: "The Veil of Maya" },
  { name: "The Sun", num: "XIX", glyph: "☉", tradition: "The Divine Illumination" },
  { name: "Judgement", num: "XX", glyph: "🜃", tradition: "The Final Trumpet" },
  { name: "The World", num: "XXI", glyph: "♄", tradition: "Return to Ein Sof" },
  { name: "Ace of Cups", num: "A·♥", glyph: "🜄", tradition: "Divine Love · Agape" },
  { name: "Three of Swords", num: "III·⚔", glyph: "△", tradition: "The Pierced Heart" },
  { name: "Five of Cups", num: "V·♥", glyph: "🜄", tradition: "The Spilled and Standing" },
  { name: "Ten of Pentacles", num: "X·◈", glyph: "◈", tradition: "The Living Legacy" },
  { name: "Page of Wands", num: "P·🔥", glyph: "🜂", tradition: "The Unlit Torch" },
  { name: "Knight of Swords", num: "Kn·⚔", glyph: "⚔", tradition: "Truth at Speed" },
  { name: "Queen of Cups", num: "Q·♥", glyph: "🜄", tradition: "The Throne of Empathy" },
  { name: "King of Pentacles", num: "K·◈", glyph: "◈", tradition: "The Patient Empire" },
  { name: "Seven of Wands", num: "VII·🔥", glyph: "🜂", tradition: "The Defended Summit" },
  { name: "Two of Cups", num: "II·♥", glyph: "🜄", tradition: "The Mirrored Soul" }
];

export const SIGN_ADJ: Record<string, string[]> = {
  Aries:       ['ignited', 'sovereign', 'first-born', 'ungoverned', 'headlong', 'scorched', 'nascent', 'raw-edged', 'unbroken', 'blazing', 'impulsive', 'initiating', 'fierce', 'untamed', 'rushing', 'crackling'],
  Taurus:      ['rooted', 'slow-turning', 'earthbound', 'unhurried', 'anchored', 'mineral', 'enduring', 'lush', 'immovable', 'patient', 'sensate', 'verdant', 'weighted', 'solid', 'persistent', 'laden'],
  Gemini:      ['doubled', 'mercurial', 'half-lit', 'mutable', 'edge-walking', 'flickering', 'bifurcated', 'restless', 'curious', 'windborne', 'plural', 'scattered', 'quicksilver', 'unresolved', 'circling', 'twice-told'],
  Cancer:      ['tidal', 'shell-wearing', 'lunar-pulled', 'interior', 'moonlit', 'retreating', 'ancestral', 'soft-shelled', 'protective', 'dreaming', 'submerged', 'tender', 'walled', 'remembering', 'saltwater', 'enclosed'],
  Leo:         ['gilded', 'sun-fixed', 'sovereign', 'heart-forward', 'performing', 'radiant', 'proud', 'generous', 'central', 'illuminated', 'magnanimous', 'warm-blooded', 'theatrical', 'glowing', 'named', 'seen'],
  Virgo:       ['precise', 'discerning', 'grain-sorted', 'quiet-handed', 'exact', 'ritual', 'attending', 'mending', 'cleansed', 'analytical', 'devoted', 'fault-finding', 'minimal', 'careful', 'ordered', 'gathered'],
  Libra:       ['suspended', 'weighing', 'wind-minded', 'both-sided', 'aesthetic', 'hovering', 'diplomatic', 'unresolved', 'harmonising', 'soft-spoken', 'mirrored', 'balanced', 'air-born', 'refining', 'considering', 'between'],
  Scorpio:     ['subterranean', 'molten', 'still-water', 'unblinking', 'venom-laced', 'regenerating', 'deep-cut', 'obsidian', 'penetrating', 'fixed', 'alchemical', 'silent', 'magnetic', 'unearthing', 'relentless', 'unseen'],
  Sagittarius: ['arrow-loosed', 'horizon-bound', 'fire-riding', 'expansive', 'half-wild', 'philosophical', 'wandering', 'truth-hungry', 'centauric', 'boundless', 'bright-aimed', 'roaming', 'questioning', 'free', 'overshot', 'becoming'],
  Capricorn:   ['stone-built', 'patient-climbing', 'winter-born', 'austere', 'load-bearing', 'long-shadowed', 'mineral', 'summit-seeking', 'structured', 'disciplined', 'enduring', 'measured', 'reserved', 'ancient', 'earned', 'slow-lit'],
  Aquarius:    ['electric', 'detached', 'future-haunted', 'cold-lit', 'visionary', 'estranged', 'signal-sending', 'air-fixed', 'alien', 'reforming', 'disconnected', 'crystalline', 'strange', 'remote', 'ahead', 'untouched'],
  Pisces:      ['dissolving', 'oceanic', 'border-thin', 'permeable', 'fog-born', 'dreaming', 'everything-and-nothing', 'uncontained', 'fluid', 'boundaryless', 'surrendered', 'empathic', 'mythic', 'liminal', 'wavering', 'unnamed'],
};

export const CARD_ADJ: Record<string, string[]> = {
  'The Fool':          ['threshold', 'unbegun', 'unburdened', 'about to fall', 'leaping'],
  'The Magician':      ['channelling', 'willed', 'instrumental', 'deliberate', 'conjuring'],
  'The High Priestess':['veiled', 'unspeaking', 'between', 'lunar', 'kept'],
  'The Empress':       ['abundant', 'embodied', 'fertile', 'earthen', 'overflowing'],
  'The Emperor':       ['structured', 'lawful', 'fathered', 'built', 'immovable'],
  'The Hierophant':    ['inherited', 'transmitted', 'orthodox', 'encoded', 'received'],
  'The Lovers':        ['choosing', 'split', 'mirrored', 'covenanted', 'doubled'],
  'The Chariot':       ['directed', 'harnessed', 'moving', 'controlled', 'driven'],
  'Strength':          ['tamed', 'soft-powerful', 'patient', 'animal', 'held'],
  'The Hermit':        ['solitary', 'lantern-holding', 'withdrawn', 'inward', 'alone'],
  'Wheel of Fortune':  ['turning', 'cyclic', 'fated', 'indifferent', 'returning'],
  'Justice':           ['consequenced', 'balanced', 'exacting', 'clear', 'answering'],
  'The Hanged Man':    ['suspended', 'inverted', 'waiting', 'surrendered', 'still'],
  'Death':             ['ending', 'composting', 'releasing', 'transforming', 'departing'],
  'Temperance':        ['alchemising', 'patient', 'blending', 'middle', 'measured'],
  'The Devil':         ['bound', 'shadowed', 'chained', 'seduced', 'refusing to leave'],
  'The Tower':         ['struck', 'collapsing', 'revealed', 'sudden', 'undone'],
  'The Star':          ['hoping', 'wounded-guiding', 'night-lit', 'open', 'visible'],
  'The Moon':          ['illusory', 'subterranean', 'howling', 'unclear', 'dreaming'],
  'The Sun':           ['clarified', 'returned', 'warm', 'visible', 'named'],
  'Judgement':         ['called', 'resurrected', 'answered', 'awakened', 'summoned'],
  'The World':         ['completed', 'dancing', 'encompassed', 'whole', 'arrived'],
  'Ace of Cups':       ['overflowing', 'given', 'opened', 'held out', 'beginning'],
  'Three of Swords':   ['pierced', 'grief-clear', 'through-cut', 'named at last', 'honest'],
  'Five of Cups':      ['mourning', 'spilled', 'backwards-facing', 'grieving', 'still counting'],
  'Ten of Pentacles':  ['legacy-built', 'accumulated', 'inherited', 'lasting', 'given forward'],
  'Page of Wands':     ['spark-stage', 'unlit', 'restless', 'almost-beginning', 'bright'],
  'Knight of Swords':  ['charging', 'truth-first', 'fast', 'unpausing', 'cutting through'],
  'Queen of Cups':     ['witnessed', 'empathic', 'throne-holding', 'feeling-named', 'present'],
  'King of Pentacles': ['patient-mastered', 'solid', 'earned', 'unhurried', 'grounded'],
  'Seven of Wands':    ['defended', 'summit-alone', 'holding ground', 'outnumbered', 'standing'],
  'Two of Cups':       ['mirrored', 'meeting', 'recognised', 'offered', 'mutual']
};

export const TEMPLATES_LINE = [
  'something {chart} and {card} —',
  'the {sign} in you, {card}',
  'a {chart} thing {card} in the dark',
  '{card}, as only the {sign} knows how',
  'what is {chart} becomes {card}',
  'the {sign} tongue — {chart}, {card}',
  '{chart} light through a {card} window',
  'born {chart}, arriving {card}',
  'the {sign} moves {chart} here — {card}',
  'neither {chart} nor {card}, both',
  'the {chart} part of you that is {card}',
  '{chart} like {sign}, {card} like water',
  'to be {chart} is to become {card}',
  'the {card} surface of a {chart} thing',
  '{chart} hands, {card} intentions',
  'something {sign} — {chart} until {card}',
  '{chart} where it started, {card} where it lands',
  'the {sign} way of being {card}',
  'not quite {chart}, not yet {card}',
  '{card} — which is what {chart} looks like from the outside'
];

export const TEMPLATES_SYNTHESIS = [
  'The {sun} carries something {sunAdj}. The {moon} holds something {moonAdj}. What the cards have drawn toward the surface — {cardAdj1}, then {cardAdj2} — is not new, only finally visible.',
  'Something {sunAdj} in the bones. Something {moonAdj} in the blood. The spread names the space between: {cardAdj1} pressing against {cardAdj2}, the self as its own unfinished argument.',
  'The {sun} arrives {sunAdj}. The {moon} stays {moonAdj}. The three positions reveal what the chart already suspected — a {cardAdj1} life navigating a {cardAdj2} world, still translating.',
  'There is something {sunAdj} about the way it begins, and something {moonAdj} about the way it ends. The middle is what the cards name: {cardAdj1}, then {cardAdj2}, then the long silence after.'
];

export const CARD_SINS: Record<string, string> = {
  'The Fool': 'Gluttony', 'The Magician': 'Pride', 'The High Priestess': 'Envy',
  'The Empress': 'Lust', 'The Emperor': 'Pride', 'The Hierophant': 'Sloth',
  'The Lovers': 'Lust', 'The Chariot': 'Pride', 'Strength': 'Pride',
  'The Hermit': 'Sloth', 'Wheel of Fortune': 'Greed', 'Justice': 'Wrath',
  'The Hanged Man': 'Sloth', 'Death': 'Wrath', 'Temperance': 'Gluttony',
  'The Devil': 'Greed', 'The Tower': 'Wrath', 'The Star': 'Envy',
  'The Moon': 'Envy', 'The Sun': 'Pride', 'Judgement': 'Wrath',
  'The World': 'Gluttony', 'Ace of Cups': 'Lust', 'Three of Swords': 'Wrath',
  'Five of Cups': 'Envy', 'Ten of Pentacles': 'Greed', 'Page of Wands': 'Lust',
  'Knight of Swords': 'Wrath', 'Queen of Cups': 'Lust', 'King of Pentacles': 'Greed',
  'Seven of Wands': 'Pride', 'Two of Cups': 'Lust'
};

export const SIN_MANIFESTATIONS: Record<string, { boon: string; buff: string; curse: string }> = {
  'Pride': {
    boon: "You are imbued with absolute certainty. The world bends to the weight of your presence, and doubt shatters against your skin.",
    buff: "You gain a surge of confidence, shielding you from criticism, though it isolates you. You elevate yourself, but the air grows incredibly thin.",
    curse: "Your vision narrows entirely to your own brilliance. You are blinded by the light of your own making, unable to see the earth rushing to meet you."
  },
  'Greed': {
    boon: "The material fabric of the world aligns in your favor. What you reach for is already moving toward your open hands.",
    buff: "You are granted the sharp, unblinking eye to see opportunity where others see dirt, but you are cursed with the inability to ever feel sated.",
    curse: "You accumulate without end, but the vessel is cracked. You will possess everything, and it will mean absolutely nothing."
  },
  'Lust': {
    boon: "You become a conduit for feral inspiration and visceral attraction. The world is drawn inexorably toward your center.",
    buff: "You are fueled by a sudden, violent passion that overrides all logic. It is a powerful engine, but it runs entirely on your own blood.",
    curse: "Obsession eclipses reason. You will be entirely consumed by the object of your fixation, leaving nothing of your original self behind."
  },
  'Envy': {
    boon: "You are granted the terrifying ability to see the hidden worth and secret flaws in others, turning comparison into absolute strategic advantage.",
    buff: "You are driven to outpace your peers, fueled by a dark, competitive venom. It propels you forward, but leaves a bitter taste in your mouth.",
    curse: "Your own blessings will rot before your eyes, rendered entirely invisible by your fixation on the light of another. You will starve while watching them eat."
  },
  'Gluttony': {
    boon: "You possess the terrifying capacity to absorb every experience, metabolizing chaos and turning excess into pure, raw power.",
    buff: "You are given the endurance to process overwhelming amounts of stress or indulgence without breaking, but you will never know when to stop.",
    curse: "You are paralyzed by abundance. The flood of your own desires will rise above your head, drowning you in the very things you craved."
  },
  'Wrath': {
    boon: "Your anger becomes a precise and holy instrument. It will clear away the dead wood, striking down false idols without consuming your own foundation.",
    buff: "You are granted unstoppable momentum to annihilate the obstacles in your path, but the heat of your advance will alienate those who walk beside you.",
    curse: "The fire turns inward and outward at once. You will destroy the guilty and the innocent indiscriminately, leaving yourself to rule over ashes."
  },
  'Sloth': {
    boon: "You achieve perfect, unbothered stillness. You conserve your essence while the world exhausts itself beating against your walls.",
    buff: "Urgency fails to penetrate your aura. You are completely protected by a heavy apathy, but you watch your life pass as if through a thick fog.",
    curse: "Atrophy rots the foundation. Time and opportunity will continue to move forward, but you will remain forever trapped exactly where you are."
  }
};

export const CARD_CONJ: Record<string, string[]> = {
  'Sun': ['Sun'], 'Moon': ['Moon'], 'Star': ['Venus', 'Moon'], 'Tower': ['Mars', 'Saturn'],
  'Devil': ['Saturn'], 'Lovers': ['Venus', 'Moon'], 'Chariot': ['Mars', 'Sun'],
  'Strength': ['Sun', 'Mars'], 'Hermit': ['Saturn', 'Mercury'], 'Wheel': ['Jupiter', 'Sun'],
  'Justice': ['Saturn', 'Mercury'], 'Hanged': ['Moon'], 'Death': ['Mars'],
  'Temperance': ['Jupiter', 'Venus'], 'Priestess': ['Moon'], 'Empress': ['Venus', 'Moon'],
  'Emperor': ['Sun', 'Saturn'], 'Hierophant': ['Jupiter', 'Saturn'],
  'Magician': ['Mercury', 'Sun'], 'Fool': ['Sun'], 'Judgement': ['Sun'],
  'World': ['Saturn', 'Jupiter'], 'Cups': ['Moon', 'Venus'], 'Swords': ['Mars', 'Mercury'],
  'Wands': ['Sun', 'Mars'], 'Pentacles': ['Saturn', 'Venus']
};

export function getSunSign(month: number, day: number): number {
  const cuts = [
    [3, 21], [4, 20], [5, 21], [6, 21], [7, 23], [8, 23],
    [9, 23], [10, 23], [11, 22], [12, 22], [1, 20], [2, 19]
  ];
  for (let i = 0; i < 12; i++) {
    const [m, d] = cuts[i];
    const [nm, nd] = cuts[(i + 1) % 12];
    if ((month === m && day >= d) || (month === nm && day < nd)) return i;
  }
  return 9;
}

export function toJD(year: number, month: number, day: number, hour = 12): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const JDN = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  return JDN + (hour - 12) / 24;
}

export function getMoonSign(jd: number): number {
  const REF_JD = 2451549.5;
  const REF_SIGN = 9;
  const LUNAR = 29.530589;
  const SIGN_DAYS = LUNAR / 12;
  const offset = Math.floor((jd - REF_JD) / SIGN_DAYS) % 12;
  return ((REF_SIGN + offset) % 12 + 12) % 12;
}

export function getRisingSign(jd: number, birthHour: number): number {
  const sunLon = (jd - 2451545.0) * 360 / 365.25;
  const sunSign = Math.floor(((sunLon % 360) + 360) % 360 / 30);
  const signOffset = Math.round((birthHour - 12) / 2);
  return ((sunSign + signOffset + 3) % 12 + 12) % 12;
}

export function getArabicGlitchText(): string {
  const arabicChars = 'ابجدهوزحطيكلمنسعفصقرشتثخذضظغ✦❂✡☽☉♀♂☿♃♄♆';
  return arabicChars[Math.floor(Math.random() * arabicChars.length)];
}

// ─── EXPANDED TYPES ───

export type SpreadType = 'single' | 'triple' | 'cross'; // single=1 card, triple=3, cross=5

export interface ReadingRecord {
  id: string;
  timestamp: number;
  user: NatalUser;
  spreadType: SpreadType;
  drawnCards: DrawnCard[];
  synthesis: string[];
  sinOutcome: string;
  dominantSin: string;
  notes?: string;
}

export interface CardSynergy {
  cardA: string;
  cardB: string;
  name: string;
  description: string;
  intensity: 'subtle' | 'potent' | 'cataclysmic';
}

export interface AspectNode {
  id: string;
  type: 'card' | 'sign' | 'planet' | 'sin';
  label: string;
  glyph: string;
  color: string;
  connections: string[]; // IDs of connected nodes
}

export interface CardLore {
  name: string;
  upright: string;
  reversed: string;
  shadow: string;
  question: string;
  gift: string;
  warning: string;
  planetaryBody: string[];
  element: 'Fire' | 'Water' | 'Air' | 'Earth' | 'Spirit';
  sephira: string;
  alchemicalStage: string;
  keywords: string[];
}

// Detailed card lore for every card in the DECK
export const CARD_LORE: Record<string, CardLore> = {
  'The Fool': {
    name: 'The Fool',
    upright: 'A leap into the unknown. You stand at a precipice, unburdened by the weight of the past. The only requirement is willingness.',
    reversed: 'Recklessness mistaken for courage. You leap without looking, and the ground will not catch you gently.',
    shadow: 'Naivety wearing the mask of wisdom. The fool who refuses to learn remains a fool.',
    question: 'What would you do if you were not afraid?',
    gift: 'Absolute newness — the gift of a blank canvas.',
    warning: 'Do not mistake carelessness for freedom.',
    planetaryBody: ['Sun'],
    element: 'Spirit',
    sephira: 'Kether → Chokmah',
    alchemicalStage: 'Prima Materia',
    keywords: ['beginning', 'innocence', 'spontaneity', 'leap', 'trust']
  },
  'The Magician': {
    name: 'The Magician',
    upright: 'All tools are at your disposal. The four elements bow to your will. You are the conduit between above and below.',
    reversed: 'Manipulation disguised as mastery. You use your tools to deceive — yourself first, then others.',
    shadow: 'The trickster who has forgotten they are performing.',
    question: 'What are you trying to manifest, and why?',
    gift: 'The power to channel will into form.',
    warning: 'Power without purpose becomes performance.',
    planetaryBody: ['Mercury', 'Sun'],
    element: 'Spirit',
    sephira: 'Kether → Binah',
    alchemicalStage: 'Calcination',
    keywords: ['manifestation', 'will', 'skill', 'resource', 'concentration']
  },
  'The High Priestess': {
    name: 'The High Priestess',
    upright: 'The veil is thin. You sit at the threshold of what is known and what is felt. Wisdom comes not through striving, but through stillness.',
    reversed: 'Secrets withheld, intuition silenced. You know the truth but refuse to speak it — even to yourself.',
    shadow: 'The gatekeeper who has forgotten what lies beyond the gate.',
    question: 'What do you know that you are not acknowledging?',
    gift: 'Access to the inner temple of knowing.',
    warning: 'Silence can become a prison.',
    planetaryBody: ['Moon'],
    element: 'Water',
    sephira: 'Kether → Tiphareth',
    alchemicalStage: 'Dissolution',
    keywords: ['intuition', 'mystery', 'inner knowing', 'veil', 'stillness']
  },
  'The Empress': {
    name: 'The Empress',
    upright: 'Creation in its most abundant form. The earth is fertile beneath your feet. Whatever you nurture will grow.',
    reversed: 'Smothering love, creative drought. You pour into empty vessels and wonder why they never fill.',
    shadow: 'The mother who consumes her children.',
    question: 'What in your life needs nurturing rather than pushing?',
    gift: 'The fertile ground and the patience to tend it.',
    warning: 'Abundance without boundaries becomes chaos.',
    planetaryBody: ['Venus', 'Moon'],
    element: 'Earth',
    sephira: 'Chokmah → Binah',
    alchemicalStage: 'Separation',
    keywords: ['fertility', 'nurturing', 'nature', 'abundance', 'creation']
  },
  'The Emperor': {
    name: 'The Emperor',
    upright: 'Structure built to last. Your authority comes from lived experience, not borrowed power. The kingdom is yours because you built it.',
    reversed: 'Tyranny dressed as order. You control because you fear chaos — but your control is the chaos.',
    shadow: 'The father who rules an empty throne.',
    question: 'Where are you building walls that should be bridges?',
    gift: 'The architecture of a stable world.',
    warning: 'Order without compassion is oppression.',
    planetaryBody: ['Sun', 'Saturn'],
    element: 'Fire',
    sephira: 'Chokmah → Tiphareth',
    alchemicalStage: 'Conjunction',
    keywords: ['authority', 'structure', 'stability', 'father', 'protection']
  },
  'The Hierophant': {
    name: 'The Hierophant',
    upright: 'Sacred knowledge transmitted through lineage. You are being initiated into a tradition larger than yourself.',
    reversed: 'Dogma without spirit. Empty ritual performed for an audience of none.',
    shadow: 'The priest who has lost their faith.',
    question: 'What tradition serves you, and what tradition are you serving?',
    gift: 'A map passed down through generations.',
    warning: 'Tradition without questioning becomes prison.',
    planetaryBody: ['Jupiter', 'Saturn'],
    element: 'Earth',
    sephira: 'Chokmah → Chesed',
    alchemicalStage: 'Fermentation',
    keywords: ['tradition', 'teaching', 'belief', 'ritual', 'guidance']
  },
  'The Lovers': {
    name: 'The Lovers',
    upright: 'The moment of choosing — and being chosen. Two paths diverge, and both are real. Love is the decision to become whole.',
    reversed: 'Division mistaken for choice. You stand at the crossroads and refuse to move.',
    shadow: 'The beloved who cannot love themselves.',
    question: 'What choice are you avoiding by calling it fate?',
    gift: 'The mirror that reflects your true self.',
    warning: 'Union without boundaries is dissolution.',
    planetaryBody: ['Venus', 'Moon'],
    element: 'Air',
    sephira: 'Binah → Tiphareth',
    alchemicalStage: 'Conjunction',
    keywords: ['love', 'choice', 'union', 'mirror', 'commitment']
  },
  'The Chariot': {
    name: 'The Chariot',
    upright: 'Triumph through will. The opposing forces within you have been harnessed, not destroyed. You move forward because you have integrated your contradictions.',
    reversed: 'The horses have thrown the driver. Your ambition outruns your capacity to steer.',
    shadow: 'Victory without meaning.',
    question: 'What are you trying to outrun?',
    gift: 'The vehicle of your determination.',
    warning: 'Speed without direction is disaster.',
    planetaryBody: ['Mars', 'Sun'],
    element: 'Water',
    sephira: 'Binah → Geburah',
    alchemicalStage: 'Sublimation',
    keywords: ['victory', 'willpower', 'determination', 'control', 'triumph']
  },
  'Strength': {
    name: 'Strength',
    upright: 'The gentleness that tames the beast. Not force, but presence. You hold the lion not by the leash, but by the gaze.',
    reversed: 'The beast has consumed the tamer. Your raw instincts rule unchecked.',
    shadow: 'The strong who have forgotten tenderness.',
    question: 'What within you needs to be held, not conquered?',
    gift: 'The infinite patience of true power.',
    warning: 'Gentleness without boundaries invites harm.',
    planetaryBody: ['Sun', 'Mars'],
    element: 'Fire',
    sephira: 'Chesed → Geburah',
    alchemicalStage: 'Fixation',
    keywords: ['inner strength', 'patience', 'compassion', 'courage', 'taming']
  },
  'The Hermit': {
    name: 'The Hermit',
    upright: 'The lantern in the dark. You have withdrawn not from fear, but from the noise. In solitude, the answer you seek becomes visible.',
    reversed: 'Isolation disguised as wisdom. You hide from the world and call it enlightenment.',
    shadow: 'The sage who has forgotten the world.',
    question: 'What truth can only be found in your own silence?',
    gift: 'The light you carry for yourself.',
    warning: 'Solitude prolonged becomes exile.',
    planetaryBody: ['Saturn', 'Mercury'],
    element: 'Earth',
    sephira: 'Chesed → Tiphareth',
    alchemicalStage: 'Distillation',
    keywords: ['solitude', 'introspection', 'wisdom', 'guidance', 'inner light']
  },
  'Wheel of Fortune': {
    name: 'Wheel of Fortune',
    upright: 'The turn you did not cause but cannot escape. Fortune spins, and you are being lifted. What goes up must come down — but right now, you rise.',
    reversed: 'The wheel grinds downward. Bad luck or simply the natural cycle — either way, hold fast.',
    shadow: 'Fatalism that abdicates responsibility.',
    question: 'Are you riding the wheel, or being crushed by it?',
    gift: 'The cosmic alignment of timing.',
    warning: 'The wheel turns for all. Gratitude is its only anchor.',
    planetaryBody: ['Jupiter', 'Sun'],
    element: 'Fire',
    sephira: 'Chesed → Netzach',
    alchemicalStage: 'Coagulation',
    keywords: ['fortune', 'cycle', 'fate', 'change', 'turning point']
  },
  'Justice': {
    name: 'Justice',
    upright: 'The scales are balanced. What you have sown, you now reap. This is not punishment — it is the natural consequence of all your choices.',
    reversed: 'Injustice, imbalance, avoidance of accountability. You tilt the scales and pretend they are level.',
    shadow: 'The judge who cannot judge themselves.',
    question: 'What consequence are you refusing to accept?',
    gift: 'The clarity of truth and its weight.',
    warning: 'Justice without mercy is cruelty.',
    planetaryBody: ['Saturn', 'Mercury'],
    element: 'Air',
    sephira: 'Geburah → Tiphareth',
    alchemicalStage: 'Multiplication',
    keywords: ['justice', 'truth', 'accountability', 'balance', 'consequence']
  },
  'The Hanged Man': {
    name: 'The Hanged Man',
    upright: 'Suspension as transformation. You hang not as punishment but as initiation. The world looks different when you surrender the need to stand upright.',
    reversed: 'Martyrdom without purpose. You suffer because suffering feels familiar — not because it transforms.',
    shadow: 'The sacrifice who resents their own offering.',
    question: 'What would change if you stopped struggling?',
    gift: 'The liberation of surrender.',
    warning: 'Surrender must lead somewhere, or it is just giving up.',
    planetaryBody: ['Moon'],
    element: 'Water',
    sephira: 'Geburah → Hod',
    alchemicalStage: 'Putrefaction',
    keywords: ['surrender', 'suspension', 'new perspective', 'sacrifice', 'release']
  },
  'Death': {
    name: 'Death',
    upright: 'What must die is dying. The old self, the outdated identity, the attachment you outgrew. This is not an ending — it is the clearing before the planting.',
    reversed: 'Refusing to let go. You cling to what is already dead and call it loyalty.',
    shadow: 'Transformation avoided until it becomes catastrophe.',
    question: 'What are you still holding that has already left?',
    gift: 'The clearing that makes space for the new.',
    warning: 'Resist death and it will take everything, not just what needs to go.',
    planetaryBody: ['Mars'],
    element: 'Water',
    sephira: 'Tiphareth → Netzach',
    alchemicalStage: 'Mortificatio',
    keywords: ['ending', 'transformation', 'release', 'letting go', 'rebirth']
  },
  'Temperance': {
    name: 'Temperance',
    upright: 'The alchemy of balance. You pour between two vessels, and what emerges is neither one nor the other — it is something entirely new.',
    reversed: 'Imbalance, excess, spiritual bypassing. You avoid the work of integration by floating above it.',
    shadow: 'Moderation used to avoid commitment.',
    question: 'What opposites within you are waiting to be reconciled?',
    gift: 'The vessel that blends without breaking.',
    warning: 'Balance is a practice, not a destination.',
    planetaryBody: ['Jupiter', 'Venus'],
    element: 'Fire',
    sephira: 'Tiphareth → Yesod',
    alchemicalStage: 'Sublimation',
    keywords: ['balance', 'alchemy', 'moderation', 'integration', 'harmony']
  },
  'The Devil': {
    name: 'The Devil',
    upright: 'You are in chains — but the chains are loose, and only you keep them tight. The shadow you refuse to face is the shadow that owns you.',
    reversed: 'Breaking free, seeing the illusion. The chains were never locked.',
    shadow: 'Addiction disguised as desire, bondage called comfort.',
    question: 'What have you convinced yourself you cannot live without?',
    gift: 'The key that was in your hand all along.',
    warning: 'The devil only has power you give.',
    planetaryBody: ['Saturn'],
    element: 'Earth',
    sephira: 'Tiphareth → Hod',
    alchemicalStage: 'Nigredo',
    keywords: ['bondage', 'shadow', 'attachment', 'materialism', 'liberation']
  },
  'The Tower': {
    name: 'The Tower',
    upright: 'The collapse was inevitable. What was built on false foundations cannot stand. The lightning does not destroy you — it reveals what was already broken.',
    reversed: 'Delaying the inevitable. You reinforce walls that are already crumbling.',
    shadow: 'Destruction that teaches nothing.',
    question: 'What in your life is standing only because you refuse to look at it?',
    gift: 'The clearing of sudden truth.',
    warning: 'The tower falls. The question is whether you rebuild on the rubble.',
    planetaryBody: ['Mars', 'Saturn'],
    element: 'Fire',
    sephira: 'Hod → Netzach',
    alchemicalStage: 'Calcinatio',
    keywords: ['upheaval', 'revelation', 'collapse', 'truth', 'awakening']
  },
  'The Star': {
    name: 'The Star',
    upright: 'The storm has passed. You kneel by the water, and the stars above are reflected in the pool below. Hope is not a wish — it is the natural state after destruction.',
    reversed: 'Despair after the storm. You cannot see the stars because you refuse to look up.',
    shadow: 'Hope deferred until it becomes denial.',
    question: 'What is still shining that you have stopped seeing?',
    gift: 'The light that needs nothing from you to shine.',
    warning: 'Hope without action is waiting.',
    planetaryBody: ['Venus', 'Moon'],
    element: 'Air',
    sephira: 'Netzach → Yesod',
    alchemicalStage: 'Solutio',
    keywords: ['hope', 'healing', 'renewal', 'inspiration', 'peace']
  },
  'The Moon': {
    name: 'The Moon',
    upright: 'You walk in the dark, and the path is uncertain. The moonlight reveals shapes, not truths. This is the realm of intuition, dream, and the things that cannot be named.',
    reversed: 'Illusions dissolving — or deepening. Confusion reigns, and you cannot tell which way is forward.',
    shadow: 'Madness mistaken for vision.',
    question: 'What are you afraid to see clearly?',
    gift: 'The wisdom of the unconscious.',
    warning: 'The moon shows, but it does not clarify. That work is yours.',
    planetaryBody: ['Moon'],
    element: 'Water',
    sephira: 'Netzach → Malkuth',
    alchemicalStage: 'Sublimatio',
    keywords: ['illusion', 'intuition', 'dreams', 'subconscious', 'uncertainty']
  },
  'The Sun': {
    name: 'The Sun',
    upright: 'Clarity, joy, the return of light. After the long journey through shadow, you emerge into warmth. This is not luck — it is arrival.',
    reversed: 'Dimmed joy, clouded clarity. The sun is there, but you have drawn the curtains.',
    shadow: 'Brilliance that blinds.',
    question: 'What is illuminating that you have been too busy to notice?',
    gift: 'The light of unobstructed truth.',
    warning: 'Even the sun must set. Savor the warmth without clinging.',
    planetaryBody: ['Sun'],
    element: 'Fire',
    sephira: 'Hod → Yesod',
    alchemicalStage: 'Rubedo',
    keywords: ['joy', 'clarity', 'success', 'vitality', 'illumination']
  },
  'Judgement': {
    name: 'Judgement',
    upright: 'The call has come. You are being summoned to rise, to answer, to integrate all that you have been. This is resurrection, not punishment.',
    reversed: 'Refusing the call. You hear it, but you stay in the grave.',
    shadow: 'Judgment of others that masks self-judgment.',
    question: 'What version of yourself is being called to awaken?',
    gift: 'The trumpet that calls you home.',
    warning: 'The call is not optional. It will sound until you answer.',
    planetaryBody: ['Sun'],
    element: 'Fire',
    sephira: 'Hod → Malkuth',
    alchemicalStage: 'Projection',
    keywords: ['awakening', 'rebirth', 'calling', 'reckoning', 'integration']
  },
  'The World': {
    name: 'The World',
    upright: 'Completion, integration, the dance at the center of all things. You have traveled the full circle and arrived — not at an end, but at a new beginning.',
    reversed: 'Almost there but refusing to finish. The final step is the hardest.',
    shadow: 'Completion that leaves nothing behind.',
    question: 'What cycle is completing, and what is it making space for?',
    gift: 'The whole that contains all parts.',
    warning: 'Completion is not the end — it is the threshold.',
    planetaryBody: ['Saturn', 'Jupiter'],
    element: 'Earth',
    sephira: 'Yesod → Malkuth',
    alchemicalStage: 'Lapis Philosophorum',
    keywords: ['completion', 'wholeness', 'integration', 'achievement', 'cycle']
  }
};

// Card synergies — special meanings when specific pairs appear together
export const CARD_SYNERGIES: CardSynergy[] = [
  {
    cardA: 'The Fool', cardB: 'The World',
    name: 'The Full Circle',
    description: 'Beginning meets ending in a single breath. What starts today has been preparing since before you arrived.',
    intensity: 'cataclysmic'
  },
  {
    cardA: 'The Lovers', cardB: 'The Devil',
    name: 'The Choice Behind the Chains',
    description: 'Love or attachment? The line is thinner than it appears. Examine what you call love — does it set you free or hold you captive?',
    intensity: 'potent'
  },
  {
    cardA: 'Death', cardB: 'The Star',
    name: 'The Phoenix Sequence',
    description: 'The ashes are still warm, but the first light has appeared. What emerges from this ending will need nothing from the old world.',
    intensity: 'cataclysmic'
  },
  {
    cardA: 'The Tower', cardB: 'The Star',
    name: 'The Ruin and The Promise',
    description: 'The destruction was the clearing. The star was always there — you only needed to lose the tower to see it.',
    intensity: 'potent'
  },
  {
    cardA: 'The Moon', cardB: 'The Sun',
    name: 'The Eclipse Passage',
    description: 'Between the dream and the awakening lies the truth. You are neither fully in darkness nor fully in light — you are in the threshold state where transformation happens.',
    intensity: 'cataclysmic'
  },
  {
    cardA: 'The Hermit', cardB: 'The Magician',
    name: 'The Inner Alchemist',
    description: 'What you found in solitude can now be shared. The lantern becomes a wand — inner wisdom turns to outer manifestation.',
    intensity: 'potent'
  },
  {
    cardA: 'The High Priestess', cardB: 'The Hierophant',
    name: 'Inner Knowing Meets Outer Teaching',
    description: 'The mystery you carry and the tradition that holds you are in dialogue. Neither can replace the other.',
    intensity: 'subtle'
  },
  {
    cardA: 'Strength', cardB: 'The Chariot',
    name: 'The Tamed Engine',
    description: 'Gentle power and decisive motion — the beast is not only tamed, it has learned to pull. You move without breaking.',
    intensity: 'potent'
  },
  {
    cardA: 'Justice', cardB: 'Judgement',
    name: 'The Double Reckoning',
    description: 'What you have done and who you have become are being weighed together. This is not punishment — it is alignment.',
    intensity: 'potent'
  },
  {
    cardA: 'The Hanged Man', cardB: 'Death',
    name: 'The Great Release',
    description: 'Surrender and transformation are the same motion seen from different angles. You cannot hold on and be reborn.',
    intensity: 'cataclysmic'
  },
  {
    cardA: 'The Empress', cardB: 'The Emperor',
    name: 'The Sacred Marriage',
    description: 'Creation and structure, nurture and authority. These forces are not opposing — they are completing each other.',
    intensity: 'subtle'
  },
  {
    cardA: 'Wheel of Fortune', cardB: 'The World',
    name: 'The Final Turn',
    description: 'The wheel has spun for lifetimes, but now it stops. This is the turn that completes the cycle.',
    intensity: 'potent'
  }
];

// Build the full Aspect Web network
export function buildAspectWeb(drawnCards: DrawnCard[], user: NatalUser): AspectNode[] {
  const nodes: AspectNode[] = [];
  const seen = new Set<string>();
  let nodeId = 0;

  const addNode = (type: AspectNode['type'], label: string, glyph: string, color: string): string => {
    const key = `${type}:${label}`;
    if (seen.has(key)) return Array.from(nodes).find(n => `${n.type}:${n.label}` === key)?.id || '';
    seen.add(key);
    const id = `node-${nodeId++}`;
    nodes.push({ id, type, label, glyph, color, connections: [] });
    return id;
  };

  // Add card nodes
  const cardIds: string[] = [];
  drawnCards.forEach(card => {
    const id = addNode('card', card.name, card.glyph, card.reversed ? '#998358' : '#c8a45a');
    cardIds.push(id);
  });

  // Add user sign nodes
  const sunId = addNode('sign', user.sun, '☉', ELEMENT_COLOR[user.sun] || '#f5c842');
  const moonId = addNode('sign', user.moon, '☽', ELEMENT_COLOR[user.moon] || '#c8c8ff');

  // Add planet nodes from CARD_CONJ
  drawnCards.forEach(card => {
    const key = Object.keys(CARD_CONJ).find(k => card.name.toLowerCase().includes(k.toLowerCase()));
    if (key) {
      CARD_CONJ[key].forEach(planet => {
        addNode('planet', planet, getPlanetGlyph(planet), '#efede8');
      });
    }
  });

  // Add sin node
  const sin = CARD_SINS[drawnCards[0]?.name] || 'Pride';
  addNode('sin', sin, getSinGlyph(sin), '#c8a45a');

  // Create connections
  // Card to card
  for (let i = 0; i < cardIds.length; i++) {
    for (let j = i + 1; j < cardIds.length; j++) {
      const a = nodes.find(n => n.id === cardIds[i]);
      const b = nodes.find(n => n.id === cardIds[j]);
      if (a && b) {
        a.connections.push(b.id);
        b.connections.push(a.id);
      }
    }
  }

  // Card to sins
  cardIds.forEach(cid => {
    const sinNode = nodes.find(n => n.type === 'sin');
    if (sinNode) {
      const cardNode = nodes.find(n => n.id === cid);
      if (cardNode) {
        cardNode.connections.push(sinNode.id);
        sinNode.connections.push(cardNode.id);
      }
    }
  });

  // Signs to planets
  nodes.filter(n => n.type === 'planet').forEach(planetNode => {
    const sunNode = nodes.find(n => n.id === sunId);
    const moonNode = nodes.find(n => n.id === moonId);
    if (sunNode) { planetNode.connections.push(sunNode.id); sunNode.connections.push(planetNode.id); }
    if (moonNode) { planetNode.connections.push(moonNode.id); moonNode.connections.push(planetNode.id); }
  });

  return nodes;
}

function getPlanetGlyph(name: string): string {
  const map: Record<string, string> = {
    'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀',
    'Mars': '♂', 'Jupiter': '♃', 'Saturn': '♄'
  };
  return map[name] || '✦';
}

function getSinGlyph(sin: string): string {
  const map: Record<string, string> = {
    'Pride': '☀', 'Greed': '⛃', 'Lust': '⚤', 'Envy': '⛧',
    'Gluttony': '⚕', 'Wrath': '⚔', 'Sloth': '⚲'
  };
  return map[sin] || '✦';
}

// Check if two drawn cards have a synergy
export function findSynergies(drawn: DrawnCard[]): CardSynergy[] {
  const found: CardSynergy[] = [];
  for (let i = 0; i < drawn.length; i++) {
    for (let j = i + 1; j < drawn.length; j++) {
      const synergy = CARD_SYNERGIES.find(s =>
        (s.cardA === drawn[i].name && s.cardB === drawn[j].name) ||
        (s.cardA === drawn[j].name && s.cardB === drawn[i].name)
      );
      if (synergy) found.push(synergy);
    }
  }
  return found;
}

// Generate a reading ID
export function generateReadingId(): string {
  return `rd-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

// Zodiac glyph lookup
export const ZODIAC_GLYPHS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
