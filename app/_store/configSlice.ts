import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProgrammingLanguage, TypingMode } from '../coding/_utils/codeSnippets';

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

export interface ConfigState {
  theme: 'dark' | 'light';
  language: ProgrammingLanguage;
  mode: TypingMode;
  timeLimit: number | null;
  ideConfig: IDEConfig;
  isPageLoading: boolean;
}

const defaultConfig: IDEConfig = {
  cursorBlinking: 'blink',
  cursorSmoothCaretAnimation: 'on',
  cursorStyle: 'line',
  cursorWidth: 2,
  fontFamily: 'var(--font-geist-mono), Consolas, Monaco, monospace',
  fontSize: 16,
  fontWeight: 'normal',
  lineHeight: 1.5,
  letterSpacing: 0,
  tabSize: 2,
  insertSpaces: true,
  renderWhitespace: 'all',
  wordWrap: 'on',
  autoClosingBrackets: 'always',
  autoClosingQuotes: 'always',
  autoIndent: true,
};

const initialState: ConfigState = {
  theme: 'dark',
  language: 'javascript',
  mode: 'snippets',
  timeLimit: 30,
  ideConfig: defaultConfig,
  isPageLoading: false,
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.isPageLoading = action.payload;
    },
    setLanguage: (state, action: PayloadAction<ProgrammingLanguage>) => {
      state.language = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', action.payload);
      }
    },
    setMode: (state, action: PayloadAction<TypingMode>) => {
      state.mode = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('mode', action.payload);
      }
    },
    setTimeLimit: (state, action: PayloadAction<number | null>) => {
      state.timeLimit = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('timeLimit', action.payload === null ? 'null' : action.payload.toString());
      }
    },
    setIdeConfig: (state, action: PayloadAction<Partial<IDEConfig>>) => {
      state.ideConfig = { ...state.ideConfig, ...action.payload };
      if (typeof window !== 'undefined') {
        localStorage.setItem('ideConfig', JSON.stringify(state.ideConfig));
      }
    },
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = nextTheme;
      if (typeof window !== 'undefined') {
        document.cookie = `theme=${nextTheme}; path=/; max-age=31536000; SameSite=Lax`;
        if (nextTheme === 'light') {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        }
      }
    },
    hydrateConfig: (state) => {
      if (typeof window === 'undefined') return;

      // Theme hydration
      const initialTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
      state.theme = initialTheme;

      // Language hydration
      const savedLang = localStorage.getItem('language') as ProgrammingLanguage;
      if (savedLang) state.language = savedLang;

      // Mode hydration
      const savedMode = localStorage.getItem('mode') as TypingMode;
      if (savedMode) state.mode = savedMode;

      // Time Limit hydration
      const savedTime = localStorage.getItem('timeLimit');
      if (savedTime) {
        state.timeLimit = savedTime === 'null' ? null : parseInt(savedTime);
      }

      // IDE Config hydration
      const savedConfig = localStorage.getItem('ideConfig');
      if (savedConfig) {
        try {
          state.ideConfig = { ...defaultConfig, ...JSON.parse(savedConfig) };
        } catch (e) {}
      }
    },
  },
});

export const {
  setPageLoading,
  setLanguage,
  setMode,
  setTimeLimit,
  setIdeConfig,
  toggleTheme,
  hydrateConfig,
} = configSlice.actions;

export default configSlice.reducer;
