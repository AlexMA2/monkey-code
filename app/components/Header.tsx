import React from 'react';
import { Terminal, Code, Cpu, Sparkles, Clock, Layers } from 'lucide-react';
import { ProgrammingLanguage, TypingMode } from '../utils/codeSnippets';
import Select from './Select';

interface HeaderProps {
  language: ProgrammingLanguage;
  setLanguage: (lang: ProgrammingLanguage) => void;
  mode: TypingMode;
  setMode: (mode: TypingMode) => void;
  timeLimit: number | null;
  setTimeLimit: (time: number | null) => void;
  isActive: boolean;
}

export default function Header({
  language,
  setLanguage,
  mode,
  setMode,
  timeLimit,
  setTimeLimit,
  isActive,
}: HeaderProps) {
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
    <header className="w-full max-w-5xl mx-auto flex flex-col gap-6 py-6 px-4 relative z-50">
      {/* Brand logo & tagline */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-accent/20 p-2.5 rounded-xl border border-accent/40 caret-pulse">
            <Terminal className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              monkey<span className="text-accent">code</span>
            </h1>
            <p className="text-xs text-gray-400">Exclusively tailored for typing code</p>
          </div>
        </div>

        {/* Global info overlay */}
        <div className="flex items-center gap-3 text-xs bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-correct animate-pulse" />
          <span>Dev Mode Active</span>
        </div>
      </div>

      {/* Control center menu */}
      {!isActive && (
        <div className="flex flex-wrap gap-4 items-center justify-between bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-4 backdrop-blur-md">
          {/* Dropdown Selectors */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Language Selector */}
            <Select
              value={language}
              onChange={(val) => setLanguage(val as ProgrammingLanguage)}
              options={languageOptions}
              labelPrefix="Language:"
            />

            {/* Mode Selector */}
            <Select
              value={mode}
              onChange={(val) => setMode(val as TypingMode)}
              options={modeOptions}
              labelPrefix="Mode:"
            />
          </div>

          {/* Times selector */}
          <div className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800/60 px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 text-zinc-500" />
            <div className="flex gap-1.5">
              {times.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeLimit(t)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
                    timeLimit === t
                      ? 'bg-accent/15 border border-accent/30 text-accent'
                      : 'text-zinc-500 border border-transparent hover:text-zinc-300'
                  }`}
                >
                  {t}s
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
