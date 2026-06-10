import { Sliders, Sparkles, Type } from 'lucide-react';
import React, { useState } from 'react';
import { IDEConfig } from '../../coding/_hooks/useTypingTest';
import Select from '../../_components/Select';
import { useAppDispatch, useAppSelector } from '../../_store/hooks';
import { setIdeConfig } from '../../_store/configSlice';

type SettingCategory = 'cursor' | 'font' | 'common';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const config = useAppSelector((state) => state.config.ideConfig);
  const [activeCategory, setActiveCategory] = useState<SettingCategory>('cursor');

  const updateSetting = (key: keyof IDEConfig, value: any) => {
    dispatch(setIdeConfig({ [key]: value }));
  };

  const categories: { val: SettingCategory; label: string; icon: any }[] = [
    { val: 'cursor', label: 'Cursor Settings', icon: Sparkles },
    { val: 'font', label: 'Font & Layout', icon: Type },
    { val: 'common', label: 'Commonly Used', icon: Sliders },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex-1 flex flex-col md:flex-row gap-8 min-h-[500px]">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r border-card-border pb-4 md:pb-0 md:pr-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.val;
          return (
            <button
              key={cat.val}
              onClick={() => setActiveCategory(cat.val)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left ${
                isActive
                  ? 'bg-accent/10 text-accent border border-accent/25'
                  : 'text-untyped hover:bg-card-muted hover:text-foreground border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Grid Content */}
      <div className="flex-1 overflow-y-auto max-h-[600px] ">
        {activeCategory === 'cursor' && (
          <div className="flex flex-col gap-8 p-2">
            <h2 className="text-lg font-bold text-foreground border-b border-card-border pb-3">Text Editor: Cursor</h2>
            
            {/* Cursor Blinking */}
            <div className="flex flex-col gap-2 max-w-xl">
              <label className="text-sm font-semibold text-foreground/90">Editor: Cursor Blinking</label>
              <p className="text-xs text-untyped">Controls the animation style of the cursor blink.</p>
              <Select
                value={config.cursorBlinking}
                onChange={(val) => updateSetting('cursorBlinking', val)}
                options={[
                  { value: 'blink', label: 'Blink (Standard)' },
                  { value: 'smooth', label: 'Smooth (Fade)' },
                  { value: 'phase', label: 'Phase (Geometric)' },
                  { value: 'expand', label: 'Expand' },
                  { value: 'solid', label: 'Solid (No Blink)' },
                ]}
              />
            </div>

            {/* Smooth Caret Animation */}
            <div className="flex flex-col gap-2 max-w-xl">
              <label className="text-sm font-semibold text-foreground/90">Editor: Cursor Smooth Caret Animation</label>
              <p className="text-xs text-untyped">Controls whether the smooth caret animation is enabled when typing or navigating.</p>
              <Select
                value={config.cursorSmoothCaretAnimation}
                onChange={(val) => updateSetting('cursorSmoothCaretAnimation', val)}
                options={[
                  { value: 'off', label: 'Off' },
                  { value: 'on', label: 'On (Gliding Caret)' },
                  { value: 'explicit', label: 'Explicit Only' },
                ]}
              />
            </div>

            {/* Cursor Style */}
            <div className="flex flex-col gap-2 max-w-xl">
              <label className="text-sm font-semibold text-foreground/90">Editor: Cursor Style</label>
              <p className="text-xs text-untyped">Determines the geometric shape and thickness of the caret.</p>
              <Select
                value={config.cursorStyle}
                onChange={(val) => updateSetting('cursorStyle', val)}
                options={[
                  { value: 'line', label: 'Line (Standard)' },
                  { value: 'line-thin', label: 'Line Thin' },
                  { value: 'block', label: 'Block' },
                  { value: 'block-outline', label: 'Block Outline' },
                  { value: 'underline', label: 'Underline' },
                  { value: 'underline-thin', label: 'Underline Thin' },
                ]}
              />
            </div>

            {/* Cursor Width */}
            <div className="flex flex-col gap-2 max-w-xl">
              <label className="text-sm font-semibold text-foreground/90">Editor: Cursor Width</label>
              <p className="text-xs text-untyped">Controls the width of the cursor in pixels when the style is set to "line".</p>
              <input
                type="number"
                min="1"
                max="10"
                value={config.cursorWidth}
                onChange={(e) => updateSetting('cursorWidth', parseInt(e.target.value) || 2)}
                className="w-44 h-9 px-3 rounded-lg border border-card-border bg-card-bg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>
        )}

        {activeCategory === 'font' && (
          <div className="flex flex-col gap-8 p-2">
            <h2 className="text-lg font-bold text-foreground border-b border-card-border pb-3">Text Editor: Font</h2>

            {/* Font Family */}
            <div className="flex flex-col gap-2 max-w-xl">
              <label className="text-sm font-semibold text-foreground/90">Editor: Font Family</label>
              <p className="text-xs text-untyped">Defines the font faces utilized in the text editor pane (comma-separated list).</p>
              <input
                type="text"
                value={config.fontFamily}
                onChange={(e) => updateSetting('fontFamily', e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-card-border bg-card-bg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {/* Font Size */}
            <div className="flex flex-col gap-2 max-w-xl">
              <label className="text-sm font-semibold text-foreground/90">Editor: Font Size</label>
              <p className="text-xs text-untyped">Sets the font size in pixels.</p>
              <input
                type="number"
                min="12"
                max="28"
                value={config.fontSize}
                onChange={(e) => updateSetting('fontSize', parseInt(e.target.value) || 16)}
                className="w-44 h-9 px-3 rounded-lg border border-card-border bg-card-bg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {/* Font Weight */}
            <div className="flex flex-col gap-2 max-w-xl">
              <label className="text-sm font-semibold text-foreground/90">Editor: Font Weight</label>
              <p className="text-xs text-untyped">Determines the thickness or boldness of the font characters.</p>
              <Select
                value={config.fontWeight}
                onChange={(val) => updateSetting('fontWeight', val)}
                options={[
                  { value: 'normal', label: 'Normal' },
                  { value: 'bold', label: 'Bold' },
                  { value: '100', label: '100 (Thin)' },
                  { value: '300', label: '300 (Light)' },
                  { value: '500', label: '500 (Medium)' },
                  { value: '700', label: '700 (Bolder)' },
                  { value: '900', label: '900 (Black)' },
                ]}
              />
            </div>

            {/* Line Height */}
            <div className="flex flex-col gap-2 max-w-xl">
              <label className="text-sm font-semibold text-foreground/90">Editor: Line Height</label>
              <p className="text-xs text-untyped">Computes the vertical spacing multiplier allocated to each line of text.</p>
              <input
                type="number"
                step="0.1"
                min="1"
                max="3"
                value={config.lineHeight}
                onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value) || 1.5)}
                className="w-44 h-9 px-3 rounded-lg border border-card-border bg-card-bg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {/* Letter Spacing */}
            <div className="flex flex-col gap-2 max-w-xl">
              <label className="text-sm font-semibold text-foreground/90">Editor: Letter Spacing</label>
              <p className="text-xs text-untyped">Determines the horizontal tracking or letter spacing in pixels.</p>
              <input
                type="number"
                step="0.5"
                min="-2"
                max="5"
                value={config.letterSpacing}
                onChange={(e) => updateSetting('letterSpacing', parseFloat(e.target.value) || 0)}
                className="w-44 h-9 px-3 rounded-lg border border-card-border bg-card-bg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>
        )}

        {activeCategory === 'common' && (
          <div className="flex flex-col gap-8 p-2">
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
        )}
      </div>
    </div>
  );
}
