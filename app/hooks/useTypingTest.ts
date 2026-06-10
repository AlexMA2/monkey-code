import { useState, useEffect, useRef, useCallback } from 'react';
import { ProgrammingLanguage, TypingMode, CODE_SNIPPETS } from '../utils/codeSnippets';
import { tokenizeCode, TokenChar } from '../utils/tokenizer';

export interface IDEConfig {
  autoCloseBrackets: boolean;
  autoIndent: boolean;
  fontSize: number; // in pixels
  tabSize: number; // 2 or 4 spaces
  caretStyle: 'line' | 'block' | 'underline';
}

export interface TestStats {
  wpm: number;
  cpm: number;
  accuracy: number;
  errorCount: number;
  totalKeys: number;
  elapsedTime: number;
  wpmTimeline: number[];
  errorTimeline: number[];
}

export function useTypingTest() {
  // Config states
  const [language, setLanguage] = useState<ProgrammingLanguage>('javascript');
  const [mode, setMode] = useState<TypingMode>('snippets');
  const [timeLimit, setTimeLimit] = useState<number | null>(30); // null means line-count mode
  const [lineLimit, setLineLimit] = useState<number | null>(null);

  // IDE Config
  const [ideConfig, setIdeConfig] = useState<IDEConfig>({
    autoCloseBrackets: true,
    autoIndent: true,
    fontSize: 16,
    tabSize: 2,
    caretStyle: 'line',
  });

  // Snippet & Token state
  const [snippetName, setSnippetName] = useState('');
  const [snippetDescription, setSnippetDescription] = useState('');
  const [rawCode, setRawCode] = useState('');
  const [tokens, setTokens] = useState<TokenChar[]>([]);

  // Typing status
  const [typedInputs, setTypedInputs] = useState<(string | null)[]>([]); // User typed char or null
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  // Time & Stats
  const [timeLeft, setTimeLeft] = useState(30);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalKeys, setTotalKeys] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  // Graph Timeline
  const [wpmTimeline, setWpmTimeline] = useState<number[]>([]);
  const [errorTimeline, setErrorTimeline] = useState<number[]>([]);

  // Refs for tracking
  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timelineIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load a new code snippet
  const loadSnippet = useCallback((lang: ProgrammingLanguage, m: TypingMode) => {
    const list = CODE_SNIPPETS[lang][m];
    const randomIndex = Math.floor(Math.random() * list.length);
    const selected = list[randomIndex];

    setSnippetName(selected.name);
    setSnippetDescription(selected.description);
    const cleanCode = selected.code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    setRawCode(cleanCode);

    const tokenized = tokenizeCode(cleanCode, lang);
    setTokens(tokenized);

    // Initialize typed inputs with null
    setTypedInputs(new Array(tokenized.length).fill(null));
    setCurrentIndex(0);
    setIsActive(false);
    setIsFinished(false);
    setElapsedTime(0);
    setTotalKeys(0);
    setErrorCount(0);
    setWpmTimeline([]);
    setErrorTimeline([]);
    startTimeRef.current = null;

    if (timeLimit) {
      setTimeLeft(timeLimit);
    } else {
      setTimeLeft(999);
    }
  }, [timeLimit]);

  // Handle switching language/mode
  useEffect(() => {
    loadSnippet(language, mode);
  }, [language, mode, loadSnippet]);

  // Adjust time-left limit
  useEffect(() => {
    if (timeLimit) {
      setTimeLeft(timeLimit);
    }
  }, [timeLimit]);

  // Clean up timers
  const clearAllIntervals = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (timelineIntervalRef.current) clearInterval(timelineIntervalRef.current);
  };

  useEffect(() => {
    return () => clearAllIntervals();
  }, []);

  // Calculate real-time stats
  const getStats = useCallback((): TestStats => {
    const correctCount = typedInputs.reduce((acc, char, idx) => {
      if (char !== null && char === tokens[idx]?.char) {
        return acc + 1;
      }
      return acc;
    }, 0);

    const timeInMins = (elapsedTime || 1) / 60;
    // Standard WPM: 5 characters per word
    const wpm = Math.round((correctCount / 5) / timeInMins);
    const cpm = Math.round(correctCount / timeInMins);
    const accuracy = totalKeys > 0 ? Math.round((correctCount / totalKeys) * 100) : 100;

    return {
      wpm,
      cpm,
      accuracy: Math.min(100, accuracy),
      errorCount,
      totalKeys,
      elapsedTime,
      wpmTimeline,
      errorTimeline,
    };
  }, [typedInputs, tokens, elapsedTime, totalKeys, errorCount, wpmTimeline, errorTimeline]);

  // Finish test callback
  const finishTest = useCallback(() => {
    setIsActive(false);
    setIsFinished(true);
    clearAllIntervals();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (isActive && timeLimit && !isFinished) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isActive, timeLimit, isFinished, finishTest]);

  // Timeline capture (every second) for the graph
  useEffect(() => {
    if (isActive && !isFinished) {
      timelineIntervalRef.current = setInterval(() => {
        const currentStats = getStats();
        setWpmTimeline((prev) => [...prev, currentStats.wpm]);
        setErrorTimeline((prev) => [...prev, currentStats.errorCount]);
      }, 1000);
    }
    return () => {
      if (timelineIntervalRef.current) clearInterval(timelineIntervalRef.current);
    };
  }, [isActive, isFinished, getStats]);

  // Restart the test
  const restart = () => {
    loadSnippet(language, mode);
  };

  // Keyboard typing engine
  const handleKeyDown = (key: string) => {
    if (isFinished || !isFocused) return;

    // Start test on first typing action
    if (!isActive && !isFinished) {
      setIsActive(true);
      startTimeRef.current = Date.now();
    }

    setTotalKeys((prev) => prev + 1);

    // Backspace handling
    if (key === 'Backspace') {
      if (currentIndex === 0) return;

      setTypedInputs((prev) => {
        const updated = [...prev];
        let newIndex = currentIndex - 1;

        // Smart Indentation Backspace logic: If we are going back over leading indentation, delete all spaces up to the newline
        if (ideConfig.autoIndent) {
          const prevChar = tokens[newIndex]?.char;
          if (prevChar === ' ') {
            // Check if we are inside a leading whitespace block
            let scanIdx = newIndex;
            while (scanIdx > 0 && tokens[scanIdx].char === ' ') {
              scanIdx--;
            }
            if (scanIdx >= 0 && tokens[scanIdx].char === '\n') {
              // Yes, it is leading whitespace! Delete everything up to the newline
              for (let i = scanIdx + 1; i <= newIndex; i++) {
                updated[i] = null;
              }
              newIndex = scanIdx + 1; // Position cursor right after the newline
            } else {
              updated[newIndex] = null;
            }
          } else {
            updated[newIndex] = null;
          }
        } else {
          updated[newIndex] = null;
        }

        setCurrentIndex(newIndex);
        return updated;
      });
      return;
    }

    // Enter / Newline handling
    if (key === 'Enter') {
      const targetChar = tokens[currentIndex]?.char;
      const isCorrect = targetChar === '\n';

      setTypedInputs((prev) => {
        const updated = [...prev];
        updated[currentIndex] = '\n';

        let nextIdx = currentIndex + 1;

        if (!isCorrect) {
          setErrorCount((err) => err + 1);
        }

        // Smart Indentation: Skip leading whitespace of the next line
        if (ideConfig.autoIndent && nextIdx < tokens.length) {
          while (nextIdx < tokens.length && tokens[nextIdx].char === ' ') {
            // Auto-fill correct for spaces
            updated[nextIdx] = ' ';
            nextIdx++;
          }
        }

        setCurrentIndex(nextIdx);
        if (nextIdx >= tokens.length) {
          finishTest();
        }
        return updated;
      });
      return;
    }

    // Normal Character handling
    if (key.length === 1) {
      const targetChar = tokens[currentIndex]?.char;
      if (!targetChar) return;

      const isCorrect = key === targetChar;

      // Bracket Auto-closing
      const bracketPairs: Record<string, string> = {
        '(': ')',
        '{': '}',
        '[': ']',
        '"': '"',
        "'": "'",
        '`': '`',
      };

      setTypedInputs((prev) => {
        const updated = [...prev];
        updated[currentIndex] = key;

        if (!isCorrect) {
          setErrorCount((err) => err + 1);
        }

        let nextIdx = currentIndex + 1;

        // If bracket auto-close is enabled, check if user correctly typed an open bracket
        // and if the next source char is the matching closed bracket. If so, we can optionally skip or auto-close.
        if (
          ideConfig.autoCloseBrackets &&
          isCorrect &&
          bracketPairs[key] !== undefined &&
          tokens[nextIdx]?.char === bracketPairs[key]
        ) {
          // Visual completion helper - the user still typing the closing character will "overtype" it.
          // In standard typing tests, we let them proceed to type the inside if any, or they type the closing bracket next.
        }

        setCurrentIndex(nextIdx);
        if (nextIdx >= tokens.length) {
          finishTest();
        }
        return updated;
      });
    }
  };

  return {
    language,
    setLanguage,
    mode,
    setMode,
    timeLimit,
    setTimeLimit,
    lineLimit,
    setLineLimit,
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
    errorCount,
    stats: getStats(),
    restart,
    handleKeyDown,
  };
}
