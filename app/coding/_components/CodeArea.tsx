import React, { useEffect, useRef } from 'react';
import { IDEConfig } from '@hooks/useTypingTest';
import { TokenChar } from '@utils/tokenizer';
import Caret from './Caret';

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
    // Process control keys immediately and prevent default typing behavior
    if (
      e.key === 'Backspace' ||
      e.key === 'Enter' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowLeft' ||
      e.key === 'Tab'
    ) {
      e.preventDefault();
      
      if (e.key === 'Tab') {
        handleKeyDown('Tab');
        return;
      }
      handleKeyDown(e.key);
      return;
    }

    // Ignore numeric keys on keydown when Alt is held (Windows Alt Codes input: Alt + 6 + 2)
    if (e.altKey && e.key.length === 1) {
      // Let the browser handle Alt code input in the textarea value instead of processing raw numbers
      return;
    }
  };

  // Process resolved character entries from the hidden textarea (fully supports IME, Alt-codes, layouts)
  const handleTextAreaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const val = e.currentTarget.value;
    if (val) {
      for (let i = 0; i < val.length; i++) {
        handleKeyDown(val[i]);
      }
      e.currentTarget.value = ''; // Reset input buffer
    }
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

  // Helper to determine whitespace visual mapping
  const getDisplayChar = (char: string, idx: number, typed: string | null) => {
    // If incorrect, show what was typed (with red styling)
    if (typed !== null && typed !== char) {
      return typed === '\n' ? '↵\n' : typed;
    }

    if (char === ' ') {
      const rw = ideConfig.renderWhitespace;
      if (rw === 'all') return '·';
      if (rw === 'boundary' || rw === 'trailing') {
        let isLeading = true;
        for (let i = idx - 1; i >= 0; i--) {
          if (tokens[i].char === '\n') break;
          if (tokens[i].char !== ' ') {
            isLeading = false;
            break;
          }
        }
        let isTrailing = true;
        for (let i = idx + 1; i < tokens.length; i++) {
          if (tokens[i].char === '\n') break;
          if (tokens[i].char !== ' ') {
            isTrailing = false;
            break;
          }
        }
        if (rw === 'boundary' && (isLeading || isTrailing)) return '·';
        if (rw === 'trailing' && isTrailing) return '·';
      }
      return ' ';
    }
    
    if (char === '\n') {
      return ideConfig.renderWhitespace === 'all' ? '↵\n' : '\n';
    }
    
    return char;
  };

  const lineWrapClass = ideConfig.wordWrap === 'on' || ideConfig.wordWrap === 'bounded'
    ? 'whitespace-pre-wrap break-all'
    : 'whitespace-pre overflow-x-auto';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 flex-1 flex flex-col justify-center relative">
      {/* Title info */}
      <div className="mb-4 flex items-center justify-between text-xs text-untyped">
        <div>
          Code block: <span className="text-foreground font-bold">{snippetName}</span>
          {snippetDescription && ` — ${snippetDescription}`}
        </div>
        <div>
          Press <kbd className="px-1.5 py-0.5 bg-card-muted rounded border border-card-border font-mono text-[10px] text-foreground/80">Tab</kbd> then <kbd className="px-1.5 py-0.5 bg-card-muted rounded border border-card-border font-mono text-[10px] text-foreground/80">Enter</kbd> to restart
        </div>
      </div>

      {/* Hidden textarea to capture keystrokes */}
      <textarea
        ref={inputRef}
        className="absolute w-0 h-0 opacity-0 pointer-events-none"
        onKeyDown={handleInputKeyDown}
        onInput={handleTextAreaInput}
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
        onMouseDown={(e) => e.preventDefault()}
        className="w-full min-h-[300px] max-h-[450px] bg-card-bg border border-card-border rounded-3xl p-8 overflow-y-auto cursor-text font-mono relative transition-all duration-300 backdrop-blur-sm"
      >
        {/* Lost focus blur overlay */}
        {!isFocused && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center rounded-3xl z-30 select-none cursor-pointer">
            <span className="text-accent text-lg font-semibold tracking-wider animate-pulse mb-2">
              OUT OF FOCUS
            </span>
            <span className="text-xs text-untyped">
              Click here or press any key to focus
            </span>
          </div>
        )}

        <pre 
          className={`leading-relaxed select-none ${lineWrapClass}`}
          style={{
            fontFamily: ideConfig.fontFamily,
            fontSize: `${ideConfig.fontSize}px`,
            fontWeight: ideConfig.fontWeight,
            lineHeight: ideConfig.lineHeight,
            letterSpacing: `${ideConfig.letterSpacing}px`
          }}
        >
          <code>
            {tokens.map((token, idx) => {
              const typed = typedInputs[idx];
              const isCurrent = idx === currentIndex;
              
              let charColor = 'text-untyped/60'; // Untyped default
              
              // Determine character typing state color
              if (typed !== null) {
                if (typed === token.char) {
                  charColor = 'text-correct-text font-medium'; // Correctly typed
                } else {
                  charColor = 'text-error bg-error/10 border-b border-error'; // Mistyped
                }
              } else {
                // Syntax coloring for untyped text (highly muted)
                if (token.type === 'keyword') charColor = 'text-syntax-keyword/70';
                else if (token.type === 'string') charColor = 'text-syntax-string/70';
                else if (token.type === 'comment') charColor = 'text-syntax-comment/70 font-light';
                else if (token.type === 'number') charColor = 'text-syntax-number/70';
                else if (token.type === 'operator') charColor = 'text-syntax-operator/70';
                else if (token.type === 'punctuation') charColor = 'text-syntax-punctuation/70';
                else if (token.type === 'type') charColor = 'text-syntax-type/70';
                else if (token.type === 'tag') charColor = 'text-syntax-tag/70';
                else if (token.type === 'preprocessor') charColor = 'text-syntax-number/80';
                else charColor = 'text-untyped/70';
              }

              const displayChar = getDisplayChar(token.char, idx, typed);

              return (
                <span
                  key={idx}
                  ref={isCurrent ? activeCharRef : null}
                  className={`relative transition-colors duration-100 ${charColor}`}
                >
                  {isCurrent && <Caret ideConfig={ideConfig} />}
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
