import { useEffect, useRef } from 'react';
import { DrawnCard, CARD_LORE, CARD_SINS, SIN_MANIFESTATIONS, CardLore, CARD_CONJ } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CardDetailModalProps {
  card: DrawnCard | null;
  onClose: () => void;
}

function getLore(cardName: string): CardLore | null {
  return CARD_LORE[cardName] || null;
}

export default function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!card) return null;
  
  const lore = getLore(card.name);
  const sin = CARD_SINS[card.name] || 'Pride';
  const sinData = SIN_MANIFESTATIONS[sin];
  const conjKey = Object.keys(CARD_CONJ).find(k => card.name.toLowerCase().includes(k.toLowerCase()));
  const planets = conjKey ? CARD_CONJ[conjKey] : [];

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-mono select-none"
        onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, filter: 'blur(12px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          exit={{ scale: 0.85, opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[var(--gold)]/30 bg-[#050505] p-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4 pb-3 border-b border-white/10">
            <div>
              <div className="text-[7px] text-white/30 tracking-[0.3em] uppercase mb-1">
                {card.broken ? 'CORRUPT CONDUIT' : card.reversed ? 'INVERTED ASPECT' : 'FULLY MANIFEST'}
              </div>
              <h2 className="font-mono text-sm tracking-[0.15em] text-[var(--gold)] font-bold uppercase">
                {card.glyph} {card.name}
              </h2>
              <div className="text-[7px] text-white/40 tracking-[0.2em] mt-0.5">
                {card.tradition} • {card.num}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white text-lg leading-none p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Element & Planetary */}
          {lore && (
            <div className="grid grid-cols-2 gap-2 mb-4 text-[7px] tracking-[0.15em]">
              <div className="border border-white/10 p-2">
                <span className="text-white/30 block">ELEMENT</span>
                <span className="text-white font-bold">{lore.element}</span>
              </div>
              <div className="border border-white/10 p-2">
                <span className="text-white/30 block">ALCHEMICAL STAGE</span>
                <span className="text-white font-bold">{lore.alchemicalStage}</span>
              </div>
              <div className="border border-white/10 p-2">
                <span className="text-white/30 block">SEPHIRA PATH</span>
                <span className="text-white font-bold text-[6.5px]">{lore.sephira}</span>
              </div>
              <div className="border border-white/10 p-2">
                <span className="text-white/30 block">SIN ASPECT</span>
                <span className="text-[var(--gold)] font-bold">{sin}</span>
              </div>
            </div>
          )}

          {/* Upright Meaning */}
          {lore && (
            <div className="mb-3">
              <div className="text-[7px] text-white/30 tracking-[0.2em] uppercase mb-1">
                ◆ {card.reversed ? 'INVERSED READING' : 'UPRIGHT READING'}
              </div>
              <p className="font-garamond text-[13px] text-[#cfc9c0]/90 leading-relaxed italic">
                {card.reversed ? lore.reversed : lore.upright}
              </p>
            </div>
          )}

          {/* Shadow & Question */}
          {lore && (
            <div className="mb-3 space-y-2">
              <div className="border-l-2 border-[var(--gold)]/30 pl-3">
                <div className="text-[7px] text-white/20 uppercase mb-0.5">SHADOW ASPECT</div>
                <p className="font-garamond text-[11px] text-white/50 italic">{lore.shadow}</p>
              </div>
              <div className="border-l-2 border-white/20 pl-3">
                <div className="text-[7px] text-white/20 uppercase mb-0.5">THE QUESTION</div>
                <p className="font-garamond text-[11px] text-white/70 italic">{lore.question}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="border border-white/5 p-2">
                  <div className="text-[6.5px] text-white/20 uppercase">THE GIFT</div>
                  <p className="font-garamond text-[10.5px] text-[var(--gold)]/80 italic mt-0.5">{lore.gift}</p>
                </div>
                <div className="border border-white/5 p-2">
                  <div className="text-[6.5px] text-white/20 uppercase">THE WARNING</div>
                  <p className="font-garamond text-[10.5px] text-white/50 italic mt-0.5">{lore.warning}</p>
                </div>
              </div>
            </div>
          )}

          {/* Planetary Connections */}
          {planets.length > 0 && (
            <div className="mb-3">
              <div className="text-[7px] text-white/30 tracking-[0.2em] uppercase mb-1.5">
                ◆ PLANETARY ANCHORS
              </div>
              <div className="flex flex-wrap gap-2">
                {planets.map(p => (
                  <span key={p} className="border border-white/10 px-2 py-0.5 text-[8px] text-[var(--gold)] tracking-wider">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sin Manifestation */}
          {sinData && (
            <div className="mb-3 border border-white/10 p-3">
              <div className="text-[7px] text-white/30 tracking-[0.2em] uppercase mb-1">
                ◆ SIN MANIFESTATION: {sin.toUpperCase()}
              </div>
              <p className="font-garamond text-[11px] text-white/70 italic leading-relaxed">
                {sinData.boon}
              </p>
            </div>
          )}

          {/* Keywords */}
          {lore && (
            <div>
              <div className="text-[7px] text-white/30 tracking-[0.2em] uppercase mb-1">◆ KEYWORDS</div>
              <div className="flex flex-wrap gap-1.5">
                {lore.keywords.map(kw => (
                  <span key={kw} className="text-[7.5px] tracking-wider text-white/50 border border-white/10 px-1.5 py-0.5">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Broken card special */}
          {card.broken && (
            <div className="mt-4 p-3 border border-white/30 bg-black/80 text-center">
              <div className="text-[8px] text-white tracking-[0.3em] uppercase mb-1 animate-pulse">
                ⍼ CONDUIT CORRUPTED ⍼
              </div>
              <p className="font-garamond text-[11px] text-white/60 italic">
                This card has been shattered. The anomaly has been detected and is being purged.
                A new card will be drawn to replace it.
              </p>
            </div>
          )}

          {/* Close */}
          <div className="mt-5 pt-3 border-t border-white/5 text-center">
            <button
              onClick={onClose}
              className="text-[7px] tracking-[0.3em] text-white/30 hover:text-white/80 uppercase cursor-pointer transition-colors"
            >
              ◆ CLOSE DOSSIER ◆
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
