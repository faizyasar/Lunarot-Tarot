import { useState, useEffect } from 'react';
import { NatalUser, Planet } from './types';
import StarBackground from './components/StarBackground';
import AsciiBackgroundEyes from './components/AsciiBackgroundEyes';
import IntroScreen from './components/IntroScreen';
import IntakeScreen from './components/IntakeScreen';
import MainScreen from './components/MainScreen';
import HeaderNav from './components/HeaderNav';
import ShowcaseScreen from './components/ShowcaseScreen';
import AboutScreen from './components/AboutScreen';
import CodexScreen from './components/CodexScreen';
import ChronologScreen from './components/ChronologScreen';
import AmbientAudio from './components/AmbientAudio';

const SHOWCASE_DEFAULT_PLANETS: Planet[] = [
  { name: 'Sun', symbol: '☉', deg: 120, sign: 'Leo', color: '#c8a45a' },
  { name: 'Moon', symbol: '☽', deg: 245, sign: 'Taurus', color: '#998358' },
  { name: 'Rising', symbol: 'AC', deg: 45, sign: 'Aries', color: '#efede8' },
  { name: 'Mars', symbol: '♂', deg: 180, sign: 'Scorpio', color: '#c8a45a' },
  { name: 'Venus', symbol: '♀', deg: 90, sign: 'Taurus', color: '#ffffff' },
];

const SHOWCASE_DEFAULT_ACTIVE = new Set(['Sun', 'Moon', 'Rising']);

export default function App() {
  const [view, setView] = useState<'oracle' | 'codex' | 'chronolog' | 'showcase' | 'about'>('oracle');
  const [screen, setScreen] = useState<'intro' | 'intake' | 'main'>('intro');
  const [user, setUser] = useState<NatalUser | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Enable audio after first user interaction
  useEffect(() => {
    const handler = () => {
      setAudioEnabled(true);
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
    };
    window.addEventListener('click', handler);
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
    };
  }, []);

  // States representing background planetary canvas targets
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [activePlanets, setActivePlanets] = useState<Set<string>>(new Set());

  // Dynamic coordinates when switching views
  useEffect(() => {
    if (view === 'showcase') {
      setPlanets(SHOWCASE_DEFAULT_PLANETS);
      setActivePlanets(SHOWCASE_DEFAULT_ACTIVE);
    } else if (view === 'codex' || view === 'chronolog' || view === 'about') {
      setPlanets(SHOWCASE_DEFAULT_PLANETS);
      setActivePlanets(SHOWCASE_DEFAULT_ACTIVE);
    } else {
      if (user) {
        // MainScreen will calculate and broadcast coordinates
      } else {
        setPlanets([]);
        setActivePlanets(new Set());
      }
    }
  }, [view, user]);

  const handleDismissIntro = () => {
    setScreen('intake');
  };

  const handleIntakeSubmit = (natalUser: NatalUser) => {
    setUser(natalUser);
    setScreen('main');
  };

  const handleReset = () => {
    setUser(null);
    setPlanets([]);
    setActivePlanets(new Set());
    setScreen('intake');
  };

  return (
    <main className="relative w-screen h-screen max-h-screen text-[var(--parchment)] max-w-full overflow-hidden flex flex-col justify-between select-none bg-black">
      
      {/* Dynamic star twinkling and constellation background lines */}
      <StarBackground planets={planets} activePlanets={activePlanets} />

      {/* Barely visible blurred pair of ASCII eyes tracking mouse & blinking */}
      <AsciiBackgroundEyes />

      {/* Ambient drone audio */}
      <AmbientAudio enabled={audioEnabled} />

      {/* Sleek top navigation control bar */}
      <HeaderNav currentView={view} onViewChange={setView} />

      {/* Frame boundary wrapper */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center overflow-hidden">
        
        {view === 'oracle' ? (
          <>
            {screen === 'intro' && (
              <IntroScreen onDismiss={handleDismissIntro} />
            )}

            {screen === 'intake' && (
              <IntakeScreen onSubmit={handleIntakeSubmit} />
            )}

            {screen === 'main' && user && (
              <MainScreen
                user={user}
                onUpdatePlanets={setPlanets}
                onUpdateActivePlanets={setActivePlanets}
                onReset={handleReset}
              />
            )}
          </>
        ) : view === 'codex' ? (
          <CodexScreen />
        ) : view === 'chronolog' ? (
          <ChronologScreen />
        ) : view === 'showcase' ? (
          <ShowcaseScreen />
        ) : (
          <AboutScreen />
        )}
        
      </div>
      
    </main>
  );
}
