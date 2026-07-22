import { ReadingRecord, NatalUser, DrawnCard, SpreadType, generateReadingId } from '../types';

const GRIMOIRE_KEY = 'lunarot-grimoire';
const USER_KEY = 'lunarot-last-user';

export interface GrimoireState {
  readings: ReadingRecord[];
  totalDraws: number;
  mostDrawnCard: string;
  mostDrawnSign: string;
  totalAnomaliesPurged: number;
  lastVisit: number;
  oracleVersion: string;
}

function getDefaultState(): GrimoireState {
  return {
    readings: [],
    totalDraws: 0,
    mostDrawnCard: '',
    mostDrawnSign: '',
    totalAnomaliesPurged: 0,
    lastVisit: Date.now(),
    oracleVersion: '2.0.0',
  };
}

export function loadGrimoire(): GrimoireState {
  try {
    const raw = localStorage.getItem(GRIMOIRE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    return { ...getDefaultState(), ...parsed };
  } catch {
    return getDefaultState();
  }
}

export function saveGrimoire(state: GrimoireState): void {
  try {
    localStorage.setItem(GRIMOIRE_KEY, JSON.stringify({
      ...state,
      lastVisit: Date.now(),
    }));
  } catch (e) {
    console.error('[GRIMOIRE] Failed to save:', e);
  }
}

export function saveReading(
  user: NatalUser,
  spreadType: SpreadType,
  drawnCards: DrawnCard[],
  synthesis: string[],
  sinOutcome: string,
  dominantSin: string,
  notes?: string,
): GrimoireState {
  const state = loadGrimoire();
  
  const record: ReadingRecord = {
    id: generateReadingId(),
    timestamp: Date.now(),
    user,
    spreadType,
    drawnCards: drawnCards.map(c => ({ ...c })),
    synthesis: [...synthesis],
    sinOutcome,
    dominantSin,
    notes,
  };

  state.readings.unshift(record);
  state.totalDraws += 1;

  // Track most drawn card
  const cardCounts: Record<string, number> = {};
  state.readings.forEach(r => {
    r.drawnCards.forEach(c => {
      cardCounts[c.name] = (cardCounts[c.name] || 0) + 1;
    });
  });
  let maxCard = '';
  let maxCardCount = 0;
  Object.entries(cardCounts).forEach(([name, count]) => {
    if (count > maxCardCount) { maxCardCount = count; maxCard = name; }
  });
  state.mostDrawnCard = maxCard;

  // Track most drawn sign context
  const signCounts: Record<string, number> = {};
  state.readings.forEach(r => {
    const s = r.user.sun;
    signCounts[s] = (signCounts[s] || 0) + 1;
  });
  let maxSign = '';
  let maxSignCount = 0;
  Object.entries(signCounts).forEach(([sign, count]) => {
    if (count > maxSignCount) { maxSignCount = count; maxSign = sign; }
  });
  state.mostDrawnSign = maxSign;

  // Track anomaly purges
  drawnCards.forEach(c => {
    if (c.broken) state.totalAnomaliesPurged += 1;
  });

  saveGrimoire(state);
  return state;
}

export function saveLastUser(user: NatalUser): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {}
}

export function loadLastUser(): NatalUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getRecentReadings(limit = 10): ReadingRecord[] {
  const state = loadGrimoire();
  return state.readings.slice(0, limit);
}

export function clearGrimoire(): void {
  localStorage.removeItem(GRIMOIRE_KEY);
  localStorage.removeItem(USER_KEY);
}

export function exportGrimoire(): string {
  const state = loadGrimoire();
  return JSON.stringify(state, null, 2);
}
