import { useState } from 'react';
import { DECK, CARD_LORE, CARD_SINS, CARD_CONJ, CardLore } from '../types';
import GothicPanel from './GothicPanel';
import GothicButton from './GothicButton';
import { motion, AnimatePresence } from 'framer-motion';

type FilterType = 'all' | 'major' | 'minor' | 'fire' | 'water' | 'air' | 'earth' | 'spirit';

export default function CodexScreen() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const filteredCards = DECK.filter(card => {
    const lore = CARD_LORE[card.name];
    if (!lore) return filter === 'all';
    
    const searchLower = search.toLowerCase();
    if (search && !card.name.toLowerCase().includes(searchLower) && 
        !card.tradition.toLowerCase().includes(searchLower) &&
        !lore.keywords.some(k => k.includes(searchLower))) {
      return false;
    }

    if (filter === 'all') return true;
    if (filter === 'major') return parseInt(card.num) <= 21 || card.num.startsWith('X');
    if (filter === 'minor') return !(parseInt(card.num) <= 21 || card.num.startsWith('X'));
    if (filter === 'spirit') return lore.element === 'Spirit';
    return lore.element.toLowerCase() === filter;
  });

  const selectedLore = selectedCard ? CARD_LORE[selectedCard] : null;
  const selectedSin = selectedCard ? (CARD_SINS[selectedCard] || 'Pride') : null;
  const selectedPlanets = selectedCard 
    ? (() => {
        const key = Object.keys(CARD_CONJ).find(k => selectedCard.toLowerCase().includes(k.toLowerCase()));
        return key ? CARD_CONJ[key] : [];
      })()
    : [];

  const filters: { key: FilterType; label: string; glyph: string }[] = [
    { key: 'all', label: 'ALL', glyph: '✦' },
    { key: 'major', label: 'MAJOR', glyph: '☉' },
    { key: 'minor', label: 'MINOR', glyph: '☽' },
    { key: 'fire', label: 'FIRE', glyph: '🜂' },
    { key: 'water', label: 'WATER', glyph: '🜄' },
    { key: 'air', label: 'AIR', glyph: '🜁' },
    { key: 'earth', label: 'EARTH', glyph: '🜃' },
  ];

  return (
    <div className="w-full h-full max-h-full flex flex-col lg:flex-row gap-4 p-4 overflow-hidden select-text font-mono text-[10px] text-white/80 animate-[fade-in_0.8s_ease_forwards] relative z-20">
      
      {/* LEFT: Filtered Card Grid */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-3 shrink-0">
          <div className="relative flex-1 min-w-[160px] max-w-[260px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH CODEX..."
              className="w-full bg-black/60 border border-white/15 p-1.5 text-[8px] text-white tracking-[0.15em] font-mono focus:outline-none focus:border-[var(--gold)] placeholder-white/20 uppercase"
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`text-[6.5px] tracking-[0.15em] px-2 py-1 border cursor-pointer transition-all uppercase font-mono ${
                  filter === f.key
                    ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]'
                    : 'border-white/10 text-white/30 hover:border-white/30 hover:text-white/60'
                }`}
              >
                {f.glyph} {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Card Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {filteredCards.map(card => {
              const lore = CARD_LORE[card.name];
              const sin = CARD_SINS[card.name];
              const isSelected = selectedCard === card.name;

              return (
                <motion.div
                  key={card.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setSelectedCard(isSelected ? null : card.name)}
                  className={`border p-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-[var(--gold)] bg-[var(--gold)]/5 shadow-[0_0_12px_rgba(200,164,90,0.1)]'
                      : 'border-white/10 hover:border-white/25 bg-black/40 hover:bg-black/60'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-[28px] leading-none mb-1">{card.glyph}</div>
                    <div className="font-mono text-[7px] tracking-[0.12em] text-white font-bold leading-tight uppercase">
                      {card.name}
                    </div>
                    <div className="text-[5.5px] text-white/30 mt-0.5 tracking-wider">{card.num}</div>
                    {lore && (
                      <div className="flex gap-1 justify-center mt-1">
                        <span className="text-[5px] text-white/20 border border-white/10 px-1">{lore.element}</span>
                      </div>
                    )}
                    {sin && (
                      <div className="text-[5px] text-[var(--gold)]/50 mt-0.5">{sin}</div>
                    )}
                  </div>
                </motion.div>
              );
            })}
            {filteredCards.length === 0 && (
              <div className="col-span-full text-center py-8 text-white/20 font-mono text-[8px] tracking-widest uppercase">
                ✦ NO CARDS MATCH THIS FILTER ✦
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Card Detail Panel */}
      <div className="w-full lg:w-80 shrink-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedLore ? (
            <motion.div
              key={selectedCard}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <GothicPanel variant="gold" titleTag={`DOSSIER_${selectedCard?.toUpperCase().replace(/\s/g,'_') || 'CARD'}`} footerTag="CODEX_ARCHIVE">
                
                {/* Header */}
                <div className="text-center mb-3">
                  <div className="text-[40px] leading-none mb-1">
                    {DECK.find(c => c.name === selectedCard)?.glyph || '✦'}
                  </div>
                  <h3 className="font-mono text-[10px] tracking-[0.15em] text-[var(--gold)] font-bold uppercase">
                    {selectedCard}
                  </h3>
                  <div className="text-[6px] text-white/30 tracking-[0.2em] mt-0.5">
                    {DECK.find(c => c.name === selectedCard)?.num} • {selectedLore.element} • {selectedLore.alchemicalStage}
                  </div>
                </div>

                {/* Section: Sephirot */}
                <div className="mb-2">
                  <div className="text-[6px] text-white/20 tracking-[0.2em] uppercase mb-0.5">SEPHIRA PATH</div>
                  <div className="text-[7px] text-white/60 font-mono tracking-wider">{selectedLore.sephira}</div>
                </div>

                {/* Section: Meaning */}
                <div className="mb-2 border-t border-white/5 pt-2">
                  <div className="text-[6px] text-white/20 tracking-[0.2em] uppercase mb-0.5">UPRIGHT</div>
                  <p className="font-garamond text-[11px] text-[#cfc9c0]/85 italic leading-relaxed">{selectedLore.upright}</p>
                </div>

                <div className="mb-2">
                  <div className="text-[6px] text-white/20 tracking-[0.2em] uppercase mb-0.5">REVERSED</div>
                  <p className="font-garamond text-[11px] text-white/50 italic leading-relaxed">{selectedLore.reversed}</p>
                </div>

                {/* Section: Shadow & Question */}
                <div className="mb-2 border-t border-white/5 pt-2 space-y-1.5">
                  <div>
                    <div className="text-[6px] text-white/20 uppercase">SHADOW</div>
                    <p className="font-garamond text-[10px] text-white/40 italic">{selectedLore.shadow}</p>
                  </div>
                  <div>
                    <div className="text-[6px] text-white/20 uppercase">THE QUESTION</div>
                    <p className="font-garamond text-[10px] text-white/60 italic">{selectedLore.question}</p>
                  </div>
                </div>

                {/* Section: Gift & Warning */}
                <div className="mb-2 grid grid-cols-2 gap-2">
                  <div className="border border-white/5 p-1.5">
                    <div className="text-[5.5px] text-white/20 uppercase">GIFT</div>
                    <p className="font-garamond text-[9px] text-[var(--gold)]/70 italic mt-0.5">{selectedLore.gift}</p>
                  </div>
                  <div className="border border-white/5 p-1.5">
                    <div className="text-[5.5px] text-white/20 uppercase">WARNING</div>
                    <p className="font-garamond text-[9px] text-white/40 italic mt-0.5">{selectedLore.warning}</p>
                  </div>
                </div>

                {/* Section: Planetary */}
                {selectedPlanets.length > 0 && (
                  <div className="mb-2 border-t border-white/5 pt-2">
                    <div className="text-[6px] text-white/20 tracking-[0.2em] uppercase mb-1">PLANETARY BODIES</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedPlanets.map(p => (
                        <span key={p} className="text-[6.5px] text-[var(--gold)]/70 border border-white/10 px-1.5 py-0.5">{p}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section: Sin */}
                {selectedSin && (
                  <div className="mb-2 border-t border-white/5 pt-2">
                    <div className="text-[6px] text-white/20 tracking-[0.2em] uppercase mb-0.5">SIN ANCHOR</div>
                    <span className="text-[7px] text-[var(--gold)] font-mono tracking-wider">{selectedSin}</span>
                  </div>
                )}

                {/* Keywords */}
                <div className="border-t border-white/5 pt-2">
                  <div className="flex flex-wrap gap-1">
                    {selectedLore.keywords.map(kw => (
                      <span key={kw} className="text-[6px] text-white/40 border border-white/10 px-1 py-0.5">{kw}</span>
                    ))}
                  </div>
                </div>

              </GothicPanel>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center text-center"
            >
              <div className="text-white/15 font-mono text-[8px] tracking-[0.25em] uppercase">
                <div className="text-[32px] mb-2 opacity-30">⛬</div>
                SELECT A CARD<br/>TO UNVEIL<br/>ITS DOSSIER
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
