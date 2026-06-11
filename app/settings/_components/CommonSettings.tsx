'use client';

import Select from '../../_components/Select';
import { setIdeConfig } from '../../_store/configSlice';
import { useAppDispatch, useAppSelector } from '../../_store/hooks';
import { IDEConfig } from '../../coding/_hooks/useTypingTest';

export default function CommonSettings() {
  const dispatch = useAppDispatch();
  const config = useAppSelector((state) => state.config.ideConfig);

  const updateSetting = <K extends keyof IDEConfig>(key: K, value: unknown) => {
    dispatch(setIdeConfig({ [key]: value as IDEConfig[K] }));
  };

  return (
    <div className="flex flex-col gap-8 p-2 animate-in fade-in duration-200">
      <h2 className="text-lg font-bold text-foreground border-b border-card-border pb-3">Commonly Used Settings</h2>

      {/* Tab Size */}
      <div className="flex flex-col gap-2 max-w-xl">
        <label className="text-sm font-semibold text-foreground/90">Editor: Tab Size</label>
        <p className="text-xs text-untyped">Dictates the number of spaces that a single tab character equals.</p>
        <input
          type="number"
          min="2"
          max="8"
          step="2"
          value={config.tabSize}
          onChange={(e) => updateSetting('tabSize', parseInt(e.target.value) || 2)}
          className="w-44 h-9 px-3 rounded-lg border border-card-border bg-card-bg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* Insert Spaces */}
      <div className="flex flex-col gap-2 max-w-xl">
        <label className="text-sm font-semibold text-foreground/90">Editor: Insert Spaces</label>
        <p className="text-xs text-untyped">Controls whether hitting Tab inserts explicit space characters or tab characters.</p>
        <button
          onClick={() => updateSetting('insertSpaces', !config.insertSpaces)}
          className={`w-44 py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            config.insertSpaces
              ? 'bg-correct/10 border-correct/40 text-correct'
              : 'bg-card-muted border-card-border text-untyped'
          }`}
        >
          {config.insertSpaces ? 'Insert Spaces (True)' : 'Insert Tab (False)'}
        </button>
      </div>

      {/* Render Whitespace */}
      <div className="flex flex-col gap-2 max-w-xl">
        <label className="text-sm font-semibold text-foreground/90">Editor: Render Whitespace</label>
        <p className="text-xs text-untyped">Governs how hidden structural whitespace characters are visually rendered.</p>
        <Select
          value={config.renderWhitespace}
          onChange={(val) => updateSetting('renderWhitespace', val)}
          options={[
            { value: 'none', label: 'None (Invisible)' },
            { value: 'all', label: 'All (Render Symbols)' },
            { value: 'boundary', label: 'Boundary Spaces Only' },
            { value: 'trailing', label: 'Trailing Spaces Only' },
            { value: 'selection', label: 'Selection' },
          ]}
        />
      </div>

      {/* Word Wrap */}
      <div className="flex flex-col gap-2 max-w-xl">
        <label className="text-sm font-semibold text-foreground/90">Editor: Word Wrap</label>
        <p className="text-xs text-untyped">Controls whether long lines of text wrap automatically at the viewport edge.</p>
        <Select
          value={config.wordWrap}
          onChange={(val) => updateSetting('wordWrap', val)}
          options={[
            { value: 'off', label: 'Off (Scroll Horizontally)' },
            { value: 'on', label: 'On (Wrap at Edge)' },
            { value: 'wordWrapColumn', label: 'Wrap at Column' },
            { value: 'bounded', label: 'Bounded' },
          ]}
        />
      </div>

      {/* Auto Closing Brackets */}
      <div className="flex flex-col gap-2 max-w-xl">
        <label className="text-sm font-semibold text-foreground/90">Editor: Auto Closing Brackets</label>
        <p className="text-xs text-untyped">Controls whether the editor automatically closes brackets typed by the user.</p>
        <Select
          value={config.autoClosingBrackets}
          onChange={(val) => updateSetting('autoClosingBrackets', val)}
          options={[
            { value: 'always', label: 'Always' },
            { value: 'beforeWhitespace', label: 'Only Before Whitespace' },
            { value: 'languageDefined', label: 'Language Defined' },
            { value: 'never', label: 'Never' },
          ]}
        />
      </div>

      {/* Auto Closing Quotes */}
      <div className="flex flex-col gap-2 max-w-xl">
        <label className="text-sm font-semibold text-foreground/90">Editor: Auto Closing Quotes</label>
        <p className="text-xs text-untyped">Controls whether the editor automatically appends matching closing quotes.</p>
        <Select
          value={config.autoClosingQuotes}
          onChange={(val) => updateSetting('autoClosingQuotes', val)}
          options={[
            { value: 'always', label: 'Always' },
            { value: 'beforeWhitespace', label: 'Only Before Whitespace' },
            { value: 'languageDefined', label: 'Language Defined' },
            { value: 'never', label: 'Never' },
          ]}
        />
      </div>

      {/* Smart Indentation */}
      <div className="flex flex-col gap-2 max-w-xl">
        <label className="text-sm font-semibold text-foreground/90">Editor: Auto Indentation (Smart Indent)</label>
        <p className="text-xs text-untyped">Automatically skip typing leading whitespace of lines based on code structure.</p>
        <button
          onClick={() => updateSetting('autoIndent', !config.autoIndent)}
          className={`w-44 py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            config.autoIndent
              ? 'bg-correct/10 border-correct/40 text-correct'
              : 'bg-card-muted border-card-border text-untyped'
            }`}
        >
          {config.autoIndent ? 'Auto Jump Indents' : 'Disabled (Type All Spaces)'}
        </button>
      </div>
    </div>
  );
}
