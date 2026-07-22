import { useState, useEffect } from 'react';
import { loadGrimoire, clearGrimoire, exportGrimoire, GrimoireState, ReadingRecord } from '../store/grimoireStore';
import GothicPanel from './GothicPanel';
import GothicButton from './GothicButton';
import { SIGN_NAMES, ZODIAC_GLYPHS, CARD_SINS } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChronologScreen() {
  const [grimoire, setGrimoire] = useState<GrimoireState | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setGrimoire(loadGrimoire());
  }, []);

  if (!grimoire) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white/20 font-mono text-[8px] tracking-[0.3em] uppercase animate-pulse">
          ◆ LOADING GRIMOIRE ARCHIVE ◆
        </div>
      </div>
    );
  }

  if (grimoire.readings.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 overflow-y-auto">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-[48px] opacity-20">⛬</div>
          <h2 className="font-cinzel text-lg text-[var(--gold)] tracking-[0.2em]">THE GRIMOIRE IS EMPTY</h2>
          <p className="font-garamond text-[12px] text-white/40 italic leading-relaxed">
            No readings have been recorded yet. Return to the Sacred Oracle and draw your first cards.
            Every reading will be preserved here in the chronolog archive.
          </p>
          <div className="font-mono text-[7px] text-white/20 tracking-[0.3em] uppercase pt-4">
            // AWAITING FIRST DESCENT //
          </div>
        </div>
      </div>
    );
  }

  const handleClear = () => {
    if (confirmClear) {
      clearGrimoire();
      setGrimoire({ ...grimoire, readings: [], totalDraws: 0, mostDrawnCard: '', mostDrawnSign: '', totalAnomaliesPurged: 0 });
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
    }
  };

  const handleExport = () => {
    const data = exportGrimoire();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lunarot-grimoire-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const sunIdx = (reading: ReadingRecord) => SIGN_NAMES.indexOf(reading.user.sun);

  return (
    <div className="w-full h-full overflow-y-auto p-4 select-text animate-[fade-in_0.8s_ease_forwards] relative z-20">
      
      {/* Stats Banner */}
      <div className="mb-4">
        <GothicPanel variant="gold" titleTag="GRIMOIRE_TELEMETRY" footerTag={`VERSION_${grimoire.oracleVersion}`}>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div>
              <div className="text-[24px] text-[var(--gold)] font-mono font-bold">{grimoire.totalDraws}</div>
              <div className="text-[6px] text-white/30 tracking-[0.2em] uppercase">TOTAL DESCENTS</div>
            </div>
            <div>
              <div className="text-[24px] text-[var(--gold)] font-mono font-bold">{grimoire.readings.length}</div>
              <div className="text-[6px] text-white/30 tracking-[0.2em] uppercase">READINGS SEALED</div>
            </div>
            <div>
              <div className="text-[24px] text-[var(--gold)] font-mono font-bold">{grimoire.totalAnomaliesPurged}</div>
              <div className="text-[6px] text-white/30 tracking-[0.2em] uppercase">ANOMALIES PURGED</div>
            </div>
            <div>
              <div className="text-[14px] text-[var(--gold)] font-mono font-bold truncate">{grimoire.mostDrawnCard || '—'}</div>
              <div className="text-[6px] text-white/30 tracking-[0.2em] uppercase">MOST DRAWN CARD</div>
            </div>
            <div>
              <div className="text-[14px] text-[var(--gold)] font-mono font-bold">{grimoire.mostDrawnSign || '—'}</div>
              <div className="text-[6px] text-white/30 tracking-[0.2em] uppercase">RECURRING SIGN</div>
            </div>
          </div>
        </GothicPanel>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-4">
        <GothicButton variant="secondary" onClick={handleExport} className="text-[7px] py-1">
          ◆ EXPORT GRIMOIRE
        </GothicButton>
        <GothicButton 
          variant={confirmClear ? 'primary' : 'secondary'} 
          onClick={handleClear} 
          className={`text-[7px] py-1 ${confirmClear ? 'animate-pulse' : ''}`}
        >
          {confirmClear ? '◆ CONFIRM: ERASE ALL RECORDS?' : '◆ CLEAR ARCHIVE'}
        </GothicButton>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <h2 className="font-mono text-[9px] tracking-[0.25em] text-white/40 uppercase mb-3">
          ◆ READING CHRONOLOG — {grimoire.readings.length} SEALED RECORDS
        </h2>

        {grimoire.readings.map((reading, idx) => {
          const isExpanded = expandedId === reading.id;
          const sunGlyph = ZODIAC_GLYPHS[sunIdx(reading)] || '✦';

          return (
            <motion.div
              key={reading.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : reading.id)}
                className={`border cursor-pointer transition-all duration-200 ${
                  isExpanded
                    ? 'border-[var(--gold)]/40 bg-[#050505]'
                    : 'border-white/10 bg-black/40 hover:border-white/25'
                }`}
              >
                {/* Summary Row */}
                <div className="p-3 flex items-center gap-3">
                  <div className="text-[7px] text-white/20 font-mono tracking-wider w-12 shrink-0">
                    #{grimoire.readings.length - idx}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[18px]">{sunGlyph}</span>
                      <span className="font-mono text-[9px] text-white tracking-[0.12em] uppercase font-bold">
                        {reading.user.sun} {reading.user.moon}
                        {reading.user.rising ? ` • ${reading.user.rising}` : ''}
                      </span>
                      <span className="text-[6px] text-white/20 font-mono tracking-wider">
                        {reading.spreadType.toUpperCase()} SPREAD
                      </span>
                    </div>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      {reading.drawnCards.map((card, ci) => (
                        <span
                          key={ci}
                          className={`text-[6.5px] tracking-wider px-1.5 py-0.5 border ${
                            card.broken
                              ? 'border-white/30 text-white/50 line-through'
                              : card.reversed
                              ? 'border-[var(--gold)]/30 text-[var(--gold)]/60'
                              : 'border-white/15 text-white/60'
                          }`}
                        >
                          {card.glyph} {card.name}
                          {card.reversed && ' ⟳'}
                          {card.broken && ' ⍼'}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[6px] text-white/25 font-mono tracking-wider">{formatDate(reading.timestamp)}</div>
                    <div className="text-[7px] text-[var(--gold)]/60 mt-0.5">{reading.dominantSin}</div>
                  </div>
                </div>

                {/* Expanded Detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 border-t border-white/5 pt-3 space-y-3">
                        {/* Synthesis */}
                        <div>
                          <div className="text-[6px] text-white/20 tracking-[0.2em] uppercase mb-1">◆ SYNTHESIS</div>
                          {reading.synthesis.map((s, si) => (
                            <p key={si} className="font-garamond text-[11px] text-[#cfc9c0]/80 italic leading-relaxed mb-1">
                              {s}
                            </p>
                          ))}
                        </div>

                        {/* Sin Outcome */}
                        <div className="border border-white/10 p-2">
                          <div className="text-[6px] text-white/20 tracking-[0.2em] uppercase mb-0.5">
                            ◆ SIN OUTCOME: {reading.dominantSin.toUpperCase()}
                          </div>
                          <p className="font-garamond text-[10px] text-white/60 italic leading-relaxed">
                            {reading.sinOutcome}
                          </p>
                        </div>

                        {/* Card Details */}
                        <div>
                          <div className="text-[6px] text-white/20 tracking-[0.2em] uppercase mb-1">◆ CARD DETAILS</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {reading.drawnCards.map((card, ci) => {
                              const sin = CARD_SINS[card.name] || 'Pride';
                              return (
                                <div key={ci} className="border border-white/5 p-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[20px]">{card.glyph}</span>
                                    <div>
                                      <div className="text-[7px] text-white font-mono tracking-wider">{card.name}</div>
                                      <div className="text-[5.5px] text-white/30">{card.tradition}</div>
                                    </div>
                                  </div>
                                  <div className="flex gap-1 flex-wrap">
                                    {card.reversed && <span className="text-[5px] border border-[var(--gold)]/30 text-[var(--gold)]/60 px-1">REVERSED</span>}
                                    {card.broken && <span className="text-[5px] border border-white/30 text-white/50 px-1">BROKEN</span>}
                                    {!card.reversed && !card.broken && <span className="text-[5px] border border-white/10 text-white/30 px-1">UPRIGHT</span>}
                                    <span className="text-[5px] text-white/20">{sin}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {reading.notes && (
                          <div>
                            <div className="text-[6px] text-white/20 tracking-[0.2em] uppercase mb-0.5">◆ NOTES</div>
                            <p className="font-garamond text-[10px] text-white/50 italic">{reading.notes}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="h-20" />
    </div>
  );
}
