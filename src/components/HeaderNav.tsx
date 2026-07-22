interface HeaderNavProps {
  currentView: 'oracle' | 'showcase' | 'codex' | 'chronolog' | 'about';
  onViewChange: (view: 'oracle' | 'showcase' | 'codex' | 'chronolog' | 'about') => void;
  title?: string;
  subtitle?: string;
}

export default function HeaderNav({
  currentView,
  onViewChange,
  title = 'LUNAROT ENGINE OS // V.2.0',
  subtitle = 'STATUS: GRIMOIRE_ACTIVE',
}: HeaderNavProps) {
  return (
    <header className="w-full relative z-40 pt-2 pb-2 px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center select-none shrink-0 border-b border-white/10 bg-black/80 backdrop-blur-md font-mono text-[7px] md:text-[8px] tracking-[0.15em] text-white/40 gap-2">
      {/* Brand Title */}
      <div className="flex items-center gap-2">
        <span className="text-[var(--gold)] font-bold">◇</span>
        <span className="text-white/80 font-bold uppercase tracking-[0.2em]">
          {title}
        </span>
      </div>

      {/* View Selectors */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
        <button
          onClick={() => onViewChange('oracle')}
          className={`px-2.5 py-0.5 border transition-all duration-300 font-bold cursor-pointer tracking-[0.2em] text-[7px] ${
            currentView === 'oracle'
              ? 'border-white bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.3)]'
              : 'border-white/20 text-white/50 hover:text-white hover:border-white/55'
          }`}
        >
          ◈ ORACLE
        </button>

        <button
          onClick={() => onViewChange('showcase')}
          className={`px-2.5 py-0.5 border transition-all duration-300 font-bold cursor-pointer tracking-[0.2em] text-[7px] ${
            currentView === 'showcase'
              ? 'border-[var(--gold)] bg-black/60 text-[var(--gold)] shadow-[0_0_10px_rgba(200,164,90,0.2)]'
              : 'border-white/20 text-white/50 hover:text-white hover:border-white/55'
          }`}
        >
          ◆ GALLERY SHOWCASE
        </button>

        <button
          onClick={() => onViewChange('codex')}
          className={`px-2.5 py-0.5 border transition-all duration-300 font-bold cursor-pointer tracking-[0.2em] text-[7px] ${
            currentView === 'codex'
              ? 'border-[var(--gold)] bg-black/60 text-[var(--gold)] shadow-[0_0_10px_rgba(200,164,90,0.2)]'
              : 'border-white/20 text-white/50 hover:text-white hover:border-white/55'
          }`}
        >
          ⛬ CODEX
        </button>

        <button
          onClick={() => onViewChange('chronolog')}
          className={`px-2.5 py-0.5 border transition-all duration-300 font-bold cursor-pointer tracking-[0.2em] text-[7px] ${
            currentView === 'chronolog'
              ? 'border-[#efede8] bg-black/60 text-[#efede8] shadow-[0_0_10px_rgba(239,237,232,0.25)]'
              : 'border-white/20 text-white/50 hover:text-white hover:border-white/55'
          }`}
        >
          ◷ CHRONOLOG
        </button>

        <button
          onClick={() => onViewChange('about')}
          className={`px-2.5 py-0.5 border transition-all duration-300 font-bold cursor-pointer tracking-[0.2em] text-[7px] ${
            currentView === 'about'
              ? 'border-[#efede8] bg-black/60 text-[#efede8] shadow-[0_0_10px_rgba(239,237,232,0.25)]'
              : 'border-white/20 text-white/50 hover:text-white hover:border-white/55'
          }`}
        >
          ◈ ABOUT
        </button>
      </div>

      {/* Subtitle Telemetry */}
      <div className="hidden md:flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
        <span>{subtitle}</span>
      </div>
    </header>
  );
}
