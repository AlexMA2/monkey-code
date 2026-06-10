'use client';

import React, { useEffect, useRef } from 'react';
import Header from './components/Header';
import CodeArea from './components/CodeArea';
import StatsDisplay from './components/StatsDisplay';
import IDEConfigPanel from './components/IDEConfig';
import { useTypingTest } from './hooks/useTypingTest';
import { Keyboard, RefreshCw, Cpu, Award } from 'lucide-react';

export default function Home() {
  const {
    language,
    setLanguage,
    mode,
    setMode,
    timeLimit,
    setTimeLimit,
    ideConfig,
    setIdeConfig,
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
    elapsedTime,
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
        // If Enter is pressed within 1.5 seconds of pressing Tab, restart
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
    <div className="flex-1 flex flex-col justify-between bg-[#0d0e15] text-zinc-100 min-h-screen">
      {/* Top Section / Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        mode={mode}
        setMode={setMode}
        timeLimit={timeLimit}
        setTimeLimit={setTimeLimit}
        isActive={isActive}
      />

      {/* Main Core Typing Section */}
      <main className="flex-1 flex flex-col justify-center py-6">
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
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                      Time Remaining
                    </span>
                    <span className="text-3xl font-black text-accent font-mono">
                      {timeLeft}s
                    </span>
                  </div>
                  {/* Live WPM */}
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                      Current WPM
                    </span>
                    <span className="text-3xl font-black text-correct font-mono">
                      {stats.wpm}
                    </span>
                  </div>
                  {/* Live Accuracy */}
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                      Accuracy
                    </span>
                    <span className="text-3xl font-black text-white font-mono">
                      {stats.accuracy}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={restart}
                  title="Quick Restart (Tab + Enter)"
                  className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-accent/40 text-zinc-400 hover:text-accent transition-all cursor-pointer"
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

            {/* Configuration options panel */}
            {!isActive && <IDEConfigPanel config={ideConfig} setConfig={setIdeConfig} />}
          </div>
        )}
      </main>

      {/* Footer copyright */}
      <footer className="w-full max-w-5xl mx-auto py-6 px-4 border-t border-zinc-900/60 flex flex-wrap items-center justify-between text-xs text-zinc-600 gap-4 mt-8">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-zinc-700" />
          <span>Monkeycode Engine v1.0.0</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Keyboard className="w-3.5 h-3.5" /> <kbd className="px-1.5 py-0.5 bg-zinc-950 rounded text-zinc-500 border border-zinc-900">Tab</kbd> + <kbd className="px-1.5 py-0.5 bg-zinc-950 rounded text-zinc-500 border border-zinc-900">Enter</kbd> to restart
          </span>
          <span>&copy; {new Date().getFullYear()} Monkeycode. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
