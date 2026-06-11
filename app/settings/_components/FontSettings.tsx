'use client';

import React from 'react';
import Select from '@components/Select';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setIdeConfig } from '@store/configSlice';
import { IDEConfig } from '@hooks/useTypingTest';

export default function FontSettings() {
  const dispatch = useAppDispatch();
  const config = useAppSelector((state) => state.config.ideConfig);

  const updateSetting = <K extends keyof IDEConfig>(key: K, value: unknown) => {
    dispatch(setIdeConfig({ [key]: value as IDEConfig[K] }));
  };

  return (
    <div className="flex flex-col gap-8 p-2 animate-in fade-in duration-200">
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
  );
}
