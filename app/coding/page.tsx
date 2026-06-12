'use client';

import CodeArea from '@components/CodeArea';
import StatsDisplay from '@components/StatsDisplay';
import { useTypingTest } from '@hooks/useTypingTest';
import { RefreshCw } from 'lucide-react';
import { useEffect, useRef } from 'react';
import CodingSelectors from './_components/CodingSelectors';
import { Button } from '@components/ui/button';

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
    undo,
    redo,
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
      <main className="flex-1 flex flex-col justify-center relative z-10">
        {isFinished ? (
          <StatsDisplay
            stats={stats}
            restart={restart}
            language={language}
            mode={mode}
            snippetName={snippetName}
          />
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

                <Button
                  onClick={restart}
                  variant="outline"
                  size="icon"
                  title="Quick Restart (Tab + Enter)"
                  className="p-3 rounded-xl text-untyped hover:text-accent hover:border-accent/40 w-10 h-10"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
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
              undo={undo}
              redo={redo}
            />
          </div>
        )}
      </main>
    </>
  );
}
