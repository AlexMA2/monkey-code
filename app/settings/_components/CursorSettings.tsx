'use client';

import React from 'react';
import Select from '@components/Select';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setIdeConfig } from '@store/configSlice';
import { IDEConfig } from '@hooks/useTypingTest';
import { Input } from '@components/ui/input';

export default function CursorSettings() {
  const dispatch = useAppDispatch();
  const config = useAppSelector((state) => state.config.ideConfig);

  const updateSetting = <K extends keyof IDEConfig>(key: K, value: unknown) => {
    dispatch(setIdeConfig({ [key]: value as IDEConfig[K] }));
  };

  return (
    <div className="flex flex-col gap-8 p-2 animate-in fade-in duration-200">
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
        <p className="text-xs text-untyped">Controls the width of the cursor in pixels when the style is set to &quot;line&quot;.</p>
        <Input
          type="number"
          min="1"
          max="10"
          value={config.cursorWidth}
          onChange={(e) => updateSetting('cursorWidth', parseInt(e.target.value) || 2)}
          className="w-44"
        />
      </div>
    </div>
  );
}
