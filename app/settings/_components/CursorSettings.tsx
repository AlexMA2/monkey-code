'use client';

import React, { useEffect, useState } from 'react';
import ResetConfirmDialog from '@components/ResetConfirmDialog';
import Select from '@components/Select';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { IDEConfig } from '@hooks/useTypingTest';
import { setIdeConfig } from '@store/configSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import Caret from '@/coding/_components/Caret';
import { Eye, EyeOff } from 'lucide-react';

export default function CursorSettings() {
  const dispatch = useAppDispatch();
  const config = useAppSelector((state) => state.config.ideConfig);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const sampleCode = 'const count = 42;';

  useEffect(() => {
    setMounted(true);
    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    const runSimulation = () => {
      setCurrentIndex((prev) => {
        if (prev === sampleCode.length) {
          clearInterval(intervalId);
          timeoutId = setTimeout(() => {
            setCurrentIndex(0);
            intervalId = setInterval(runSimulation, 450);
          }, 3000);
          return prev;
        }
        return prev + 1;
      });
    };

    intervalId = setInterval(runSimulation, 450);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  const updateSetting = <K extends keyof IDEConfig>(key: K, value: unknown) => {
    dispatch(setIdeConfig({ [key]: value as IDEConfig[K] }));
  };

  return (
    <div className="flex flex-col gap-6 p-2 animate-in fade-in duration-200">
      {/* Title & Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border pb-3">
        <h2 className="text-lg font-bold text-foreground">Text Editor: Cursor</h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            className="flex items-center gap-1.5 text-xs h-9"
          >
            {isPreviewOpen ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                Show Preview
              </>
            )}
          </Button>
          <ResetConfirmDialog
            sectionName="Cursor Settings"
            onConfirm={() =>
              dispatch(
                setIdeConfig({
                  cursorBlinking: 'blink',
                  cursorSmoothCaretAnimation: 'on',
                  cursorStyle: 'line',
                  cursorWidth: 2,
                })
              )
            }
          />
        </div>
      </div>

      {/* Live Preview Panel at the Top */}
      {isPreviewOpen && mounted && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground">Cursor Live Preview</h3>
          </div>
          <div className="bg-card-bg border border-card-border p-5 rounded-xl font-mono text-sm relative h-20 flex items-center justify-center select-none overflow-hidden">
            <pre className="text-foreground tracking-wide relative">
              <code>
                {sampleCode.split('').map((char, idx) => {
                  const isCurrent = idx === currentIndex;
                  return (
                    <span key={idx} className="relative">
                      {isCurrent && <Caret ideConfig={config} />}
                      {char}
                    </span>
                  );
                })}
                {currentIndex === sampleCode.length && (
                  <span className="relative">
                    <Caret ideConfig={config} />
                    &nbsp;
                  </span>
                )}
              </code>
            </pre>
          </div>
        </div>
      )}

      {/* Settings Form Grid */}
      <div className="flex flex-col gap-8 mt-2">
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
            disabled={config.cursorStyle !== 'line'}
            value={config.cursorWidth}
            onChange={(e) => updateSetting('cursorWidth', parseInt(e.target.value) || 2)}
            className="w-44"
          />
        </div>
      </div>
    </div>
  );
}
