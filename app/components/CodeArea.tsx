import React, { useRef, useEffect } from 'react';
import { TokenChar } from '../utils/tokenizer';
import { IDEConfig } from '../hooks/useTypingTest';

interface CodeAreaProps {
  tokens: TokenChar[];
  typedInputs: (string | null)[];
  currentIndex: number;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  ideConfig: IDEConfig;
  handleKeyDown: (key: string) => void;
  snippetName: string;
  snippetDescription: string;
}

export default function CodeArea({
  tokens,
  typedInputs,
  currentIndex,
  isFocused,
  setIsFocused,
  ideConfig,
  handleKeyDown,
  snippetName,
  snippetDescription,
}: CodeAreaProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus hidden input on click
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  useEffect(() => {
    focusInput();
  }, []);

  // Listen to key events from hidden textarea
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent default scrolling for Space, Arrow keys, Tab
    if (
      e.key === ' ' ||
      e.key === 'Tab' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowLeft'
    ) {
      e.preventDefault();
    }

    // Ignore command/control shortcuts (like Ctrl+C, Cmd+R) but allow AltGr characters (like backslash or brackets)
    if ((e.ctrlKey && e.key.length > 1) || e.metaKey) {
      return;
    }
    
    // Support Tab restart if combination: Tab + Enter
    if (e.key === 'Tab') {
      handleKeyDown('Tab');
      return;
    }

    handleKeyDown(e.key);
  };

  // Scroll active line into view if it's long snippet
  const activeCharRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const container = containerRef.current;
      const charEl = activeCharRef.current;
      
      const charTop = charEl.offsetTop;
      const containerHeight = container.clientHeight;
      const scrollPos = container.scrollTop;

      if (charTop < scrollPos + 40 || charTop > scrollPos + containerHeight - 80) {
        container.scrollTo({
          top: charTop - containerHeight / 3,
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  // Styling helper for the caret
  const renderCaret = () => {
    const style = ideConfig.caretStyle;
    if (style === 'block') {
      return (
        <span className="inline-block w-[8px] h-[1.2em] bg-accent/80 absolute animate-pulse caret-pulse -z-10" />
      );
    }
    if (style === 'underline') {
      return (
        <span className="inline-block w-[8px] h-[2px] bg-accent absolute bottom-0 left-0 animate-caret caret-pulse" />
      );
    }
    // Default: line
    return (
      <span className="inline-block w-[2px] h-[1.2em] bg-accent absolute left-0 top-1 animate-caret caret-pulse" />
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 flex-1 flex flex-col justify-center relative">
      {/* Title info */}
      <div className="mb-4 flex items-center justify-between text-xs text-zinc-500">
        <div>
          Code block: <span className="text-zinc-400 font-bold">{snippetName}</span>
          {snippetDescription && ` — ${snippetDescription}`}
        </div>
        <div>
          Press <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 font-mono text-[10px] text-zinc-300">Tab</kbd> then <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 font-mono text-[10px] text-zinc-300">Enter</kbd> to restart
        </div>
      </div>

      {/* Hidden textarea to capture keystrokes */}
      <textarea
        ref={inputRef}
        className="absolute w-0 h-0 opacity-0 pointer-events-none"
        onKeyDown={handleInputKeyDown}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      {/* Code viewport container */}
      <div
        ref={containerRef}
        onClick={focusInput}
        className="w-full min-h-[300px] max-h-[450px] bg-zinc-950/70 border border-zinc-800 rounded-3xl p-8 overflow-y-auto cursor-text font-mono relative transition-all duration-300 backdrop-blur-sm"
        style={{ fontSize: `${ideConfig.fontSize}px` }}
      >
        {/* Lost focus blur overlay */}
        {!isFocused && (
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md flex flex-col items-center justify-center rounded-3xl z-30 select-none cursor-pointer">
            <span className="text-accent text-lg font-semibold tracking-wider animate-pulse mb-2">
              OUT OF FOCUS
            </span>
            <span className="text-xs text-zinc-400">
              Click here or press any key to focus
            </span>
          </div>
        )}

        <pre className="whitespace-pre-wrap break-all leading-relaxed select-none">
          <code>
            {tokens.map((token, idx) => {
              const typed = typedInputs[idx];
              const isCurrent = idx === currentIndex;
              
              let charColor = 'text-zinc-600'; // Untyped default
              
              // Determine character typing state color
              if (typed !== null) {
                if (typed === token.char) {
                  charColor = 'text-white font-medium'; // Correctly typed
                } else {
                  charColor = 'text-error bg-error/10 border-b border-error'; // Mistyped
                }
              } else {
                // Syntax coloring for untyped text (highly muted)
                if (token.type === 'keyword') charColor = 'text-purple-500/50';
                else if (token.type === 'string') charColor = 'text-green-500/50';
                else if (token.type === 'comment') charColor = 'text-zinc-700 font-light';
                else if (token.type === 'number') charColor = 'text-amber-500/50';
                else if (token.type === 'operator') charColor = 'text-cyan-500/50';
                else if (token.type === 'punctuation') charColor = 'text-zinc-500/50';
                else if (token.type === 'type') charColor = 'text-blue-500/50';
                else if (token.type === 'tag') charColor = 'text-rose-500/50';
                else charColor = 'text-zinc-500';
              }

              // Double check special render for whitespace/newline
              let displayChar = token.char;
              if (token.char === '\n') {
                displayChar = '↵\n';
              }

              return (
                <span
                  key={idx}
                  ref={isCurrent ? activeCharRef : null}
                  className={`relative transition-colors duration-100 ${charColor}`}
                >
                  {isCurrent && renderCaret()}
                  {displayChar}
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
