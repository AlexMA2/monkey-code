'use client';

import { Clock, Code, Layers, RefreshCw, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Select from '../_components/Select';
import CodeArea from './_components/CodeArea';
import StatsDisplay from './_components/StatsDisplay';
import { useTypingTest } from './_hooks/useTypingTest';
import { ProgrammingLanguage, TypingMode } from './_utils/codeSnippets';

// Local component for selectors (Language, Mode, Time Limit)
interface CodingSelectorsProps {
  language: ProgrammingLanguage;
  setLanguage: (lang: ProgrammingLanguage) => void;
  mode: TypingMode;
  setMode: (m: TypingMode) => void;
  timeLimit: number | null;
  setTimeLimit: (t: number | null) => void;
}

function CodingSelectors({
  language,
  setLanguage,
  mode,
  setMode,
  timeLimit,
  setTimeLimit,
}: CodingSelectorsProps) {
  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'rust', label: 'Rust' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
    { value: 'htmlcss', label: 'HTML/CSS' },
  ];

  const modeOptions = [
    { value: 'snippets', label: 'Snippets', icon: Code },
    { value: 'structures', label: 'Data Structures', icon: Layers },
    { value: 'chaos', label: 'Chaos Mode', icon: Sparkles },
  ];

  const times = [15, 30, 60];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center justify-between bg-card-bg border border-card-border rounded-2xl p-4 backdrop-blur-md">
        {/* Dropdown Selectors */}
        <div className="flex flex-wrap flex-row items-center gap-4">
          <Select
            value={language}
            onChange={(val) => setLanguage(val as ProgrammingLanguage)}
            options={languageOptions}
            labelPrefix="Language:"
            className="w-52"
          />

          <Select
            value={mode}
            onChange={(val) => setMode(val as TypingMode)}
            options={modeOptions}
            labelPrefix="Mode:"
            className="w-52"
          />
        </div>

        {/* Times selector */}
        <div className="flex items-center gap-3 bg-card-bg border border-card-border px-3 py-1.5 rounded-lg">
          <Clock className="w-4 h-4 text-untyped" />
          <div className="flex gap-1.5">
            {times.map((t) => (
              <button
                key={t}
                onClick={() => setTimeLimit(t)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
                  timeLimit === t
                    ? 'bg-accent/15 border border-accent/30 text-accent'
                    : 'text-untyped border border-transparent hover:text-foreground'
                }`}
              >
                {t}s
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CodingPage() {
  const {
    language,
    setLanguage,
    mode,
    setMode,
    timeLimit,
    setTimeLimit,
    ideConfig,
    snippetName,
    snippetDescription,
    tokens,
    typedInputs,
    currentIndex,
    isActive,
    isFinished,
    isFocused,
    setIsFocused,
    timeLeft,
    stats,
    restart,
    handleKeyDown,
  } = useTypingTest();

  const lastTabTimeRef = useRef<number>(0);

  // Global key listener for Tab + Enter quick-restart
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      
      if (e.key === 'Tab') {
        e.preventDefault();
        lastTabTimeRef.current = now;
      }
      
      if (e.key === 'Enter') {
        if (now - lastTabTimeRef.current < 1500) {
          e.preventDefault();
          restart();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [restart]);

  return (
    <>
      {/* Selector Controls - hidden during active test */}
      {!isActive && !isFinished && (
        <CodingSelectors
          language={language}
          setLanguage={setLanguage}
          mode={mode}
          setMode={setMode}
          timeLimit={timeLimit}
          setTimeLimit={setTimeLimit}
        />
      )}

      {/* Main Core Typing Section */}
      <main className="flex-1 flex flex-col justify-center py-6 relative z-10">
        {isFinished ? (
          <StatsDisplay stats={stats} restart={restart} />
        ) : (
          <div className="flex flex-col gap-6">
            {/* Live Metrics Header during typing */}
            {isActive && (
              <div className="w-full max-w-5xl mx-auto px-6 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-6">
                  {/* Timer */}
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-untyped tracking-wider">
                      Time Remaining
                    </span>
                    <span className="text-3xl font-black text-accent font-mono">
                      {timeLeft}s
                    </span>
                  </div>
                  {/* Live WPM */}
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-untyped tracking-wider">
                      Current WPM
                    </span>
                    <span className="text-3xl font-black text-correct font-mono">
                      {stats.wpm}
                    </span>
                  </div>
                  {/* Live Accuracy */}
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-untyped tracking-wider">
                      Accuracy
                    </span>
                    <span className="text-3xl font-black text-foreground font-mono">
                      {stats.accuracy}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={restart}
                  title="Quick Restart (Tab + Enter)"
                  className="p-3 bg-card-bg border border-card-border rounded-xl hover:border-accent/40 text-untyped hover:text-accent transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Interactive Code Container */}
            <CodeArea
              tokens={tokens}
              typedInputs={typedInputs}
              currentIndex={currentIndex}
              isFocused={isFocused}
              setIsFocused={setIsFocused}
              ideConfig={ideConfig}
              handleKeyDown={handleKeyDown}
              snippetName={snippetName}
              snippetDescription={snippetDescription}
            />
          </div>
        )}
      </main>
    </>
  );
}
