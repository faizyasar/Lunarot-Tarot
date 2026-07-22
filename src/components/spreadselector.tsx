import { SpreadType } from '../types';

interface SpreadSelectorProps {
  selected: SpreadType;
  onChange: (type: SpreadType) => void;
  disabled?: boolean;
}

export default function SpreadSelector({ selected, onChange, disabled }: SpreadSelectorProps) {
  const spreads: { type: SpreadType; label: string; cards: number; desc: string; glyph: string }[] = [
    {
      type: 'single',
      label: 'SINGLE DRAW',
      cards: 1,
      desc: 'A single card. Direct answer. No mediation.',
      glyph: '⦿',
    },
    {
      type: 'triple',
      label: 'TRIPLE CONDUIT',
      cards: 3,
      desc: 'Past/Present/Future. The classical trinity.',
      glyph: '⛬',
    },
    {
      type: 'cross',
      label: 'CROSS SPREAD',
      cards: 5,
      desc: 'Full cross reading. Situation, challenge, past, future, outcome.',
      glyph: '⛤',
    },
  ];

  return (
    <div className="flex gap-2">
      {spreads.map(s => (
        <button
          key={s.type}
          onClick={() => !disabled && onChange(s.type)}
          disabled={disabled}
          className={`flex-1 border p-2 text-center transition-all duration-200 cursor-pointer ${
            disabled ? 'opacity-30 cursor-not-allowed' : ''
          } ${
            selected === s.type
              ? 'border-[var(--gold)] bg-[var(--gold)]/10 shadow-[0_0_10px_rgba(200,164,90,0.1)]'
              : 'border-white/15 hover:border-white/30 bg-black/40'
          }`}
        >
          <div className="text-[18px] mb-0.5">{s.glyph}</div>
          <div className="font-mono text-[6.5px] tracking-[0.2em] text-white uppercase font-bold">
            {s.label}
          </div>
          <div className="text-[5px] text-white/40 mt-0.5 leading-tight">
            {s.cards} card{s.cards > 1 ? 's' : ''}
          </div>
        </button>
      ))}
    </div>
  );
}
