import { useState, useEffect, useRef, useCallback } from 'react';
import { ProgrammingLanguage, TypingMode, CODE_SNIPPETS } from '../_utils/codeSnippets';
import { tokenizeCode, TokenChar } from '../_utils/tokenizer';
import { useAppDispatch, useAppSelector } from '../../_store/hooks';
import { setLanguage, setMode, setTimeLimit, setIdeConfig } from '../../_store/configSlice';

export interface IDEConfig {
  cursorBlinking: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
  cursorSmoothCaretAnimation: 'off' | 'on' | 'explicit';
  cursorStyle: 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin';
  cursorWidth: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing: number;
  tabSize: number;
  insertSpaces: boolean;
  renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all';
  wordWrap: 'off' | 'on' | 'wordWrapColumn' | 'bounded';
  autoClosingBrackets: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never';
  autoClosingQuotes: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never';
  autoIndent: boolean;
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
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.config.language);
  const mode = useAppSelector((state) => state.config.mode);
  const timeLimit = useAppSelector((state) => state.config.timeLimit);
  const ideConfig = useAppSelector((state) => state.config.ideConfig);

  const [lineLimit, setLineLimit] = useState<number | null>(null);

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
    const cleanCode = selected.code
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\u00A0/g, ' ');
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

  const bracketPairs: Record<string, string> = {
    '(': ')',
    '{': '}',
    '[': ']',
    '"': '"',
    "'": "'",
    '`': '`',
  };

  // Keyboard typing engine
  const handleKeyDown = (key: string) => {
    if (isFinished || !isFocused) return;

    // Start test on first typing action
    if (!isActive && !isFinished) {
      setIsActive(true);
      startTimeRef.current = Date.now();
    }

    // Arrow keys cursor navigation
    if (key === 'ArrowRight') {
      if (currentIndex < tokens.length && typedInputs[currentIndex] !== null) {
        setCurrentIndex((prev) => prev + 1);
      }
      return;
    }

    if (key === 'ArrowLeft') {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
      return;
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
            let scanIdx = newIndex;
            while (scanIdx > 0 && tokens[scanIdx].char === ' ') {
              scanIdx--;
            }
            if (scanIdx >= 0 && tokens[scanIdx].char === '\n') {
              for (let i = scanIdx + 1; i <= newIndex; i++) {
                updated[i] = null;
              }
              newIndex = scanIdx + 1;
            } else {
              updated[newIndex] = null;
            }
          } else {
            updated[newIndex] = null;
          }
        } else {
          updated[newIndex] = null;
        }

        // Remove matching auto-closed bracket if deleting the opening bracket
        const charBeingDeleted = tokens[newIndex]?.char;
        if (charBeingDeleted && bracketPairs[charBeingDeleted] !== undefined) {
          const isDeletedQuote = charBeingDeleted === '"' || charBeingDeleted === "'" || charBeingDeleted === '`';
          const shouldDeleteClosing = isDeletedQuote
            ? ideConfig.autoClosingQuotes !== 'never'
            : ideConfig.autoClosingBrackets !== 'never';

          if (shouldDeleteClosing) {
            const closingChar = bracketPairs[charBeingDeleted];
            let depth = 1;
            let matchIdx = -1;
            for (let i = newIndex + 1; i < tokens.length; i++) {
              if (tokens[i].type === 'comment' || tokens[i].type === 'string' || tokens[i].type === 'tag') {
                continue;
              }
              if (tokens[i].char === charBeingDeleted) depth++;
              else if (tokens[i].char === closingChar) {
                depth--;
                if (depth === 0) {
                  matchIdx = i;
                  break;
                }
              }
            }
            if (matchIdx !== -1 && updated[matchIdx] === closingChar) {
              updated[matchIdx] = null;
            }
          }
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

      // Debug log comparisons to browser console
      console.log(`[Monkeycode Compare] Typed key: "${key}" (code: ${key.charCodeAt(0)}), Target character: "${targetChar}" (code: ${targetChar.charCodeAt(0)}), Matches: ${isCorrect}`);

      setTypedInputs((prev) => {
        const updated = [...prev];
        updated[currentIndex] = key;

        if (!isCorrect) {
          setErrorCount((err) => err + 1);
        }

        let nextIdx = currentIndex + 1;

        // Bracket/Quote Auto-closing (If enabled, correct, and is an opening bracket/quote)
        if (isCorrect && bracketPairs[key] !== undefined) {
          const nextChar = tokens[nextIdx]?.char;
          const isBeforeWhitespace = nextChar === undefined || nextChar === ' ' || nextChar === '\n';
          
          const isQuote = key === '"' || key === "'" || key === '`';
          const shouldAutoClose = isQuote
            ? (ideConfig.autoClosingQuotes === 'always' || 
               ideConfig.autoClosingQuotes === 'languageDefined' || 
               (ideConfig.autoClosingQuotes === 'beforeWhitespace' && isBeforeWhitespace))
            : (ideConfig.autoClosingBrackets === 'always' || 
               ideConfig.autoClosingBrackets === 'languageDefined' || 
               (ideConfig.autoClosingBrackets === 'beforeWhitespace' && isBeforeWhitespace));

          if (shouldAutoClose) {
            const closingChar = bracketPairs[key];
            let depth = 1;
            let matchIdx = -1;
            // Scan forward to find the matching closing bracket in the snippet (skipping strings, comments, tags)
            for (let i = currentIndex + 1; i < tokens.length; i++) {
              if (tokens[i].type === 'comment' || tokens[i].type === 'string' || tokens[i].type === 'tag') {
                continue;
              }
              if (tokens[i].char === key) depth++;
              else if (tokens[i].char === closingChar) {
                depth--;
                if (depth === 0) {
                  matchIdx = i;
                  break;
                }
              }
            }
            if (matchIdx !== -1) {
              updated[matchIdx] = closingChar;
            }
          }
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
    setLanguage: (lang: ProgrammingLanguage) => dispatch(setLanguage(lang)),
    mode,
    setMode: (m: TypingMode) => dispatch(setMode(m)),
    timeLimit,
    setTimeLimit: (t: number | null) => dispatch(setTimeLimit(t)),
    lineLimit,
    setLineLimit,
    ideConfig,
    setIdeConfig: (c: Partial<IDEConfig>) => dispatch(setIdeConfig(c)),
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
