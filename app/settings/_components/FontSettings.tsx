import React, { useState } from 'react';
import ResetConfirmDialog from '@components/ResetConfirmDialog';
import Select from '@components/Select';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { IDEConfig } from '@hooks/useTypingTest';
import { setIdeConfig } from '@store/configSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { Eye, EyeOff } from 'lucide-react';

const fontOptions = [
  { value: 'Geist Mono, Consolas, Monaco, monospace', label: 'Geist Mono' },
  { value: 'JetBrains Mono, Consolas, Monaco, monospace', label: 'JetBrains Mono' },
  { value: 'Fira Code, Consolas, Monaco, monospace', label: 'Fira Code' },
  { value: 'Roboto Mono, Consolas, Monaco, monospace', label: 'Roboto Mono' },
  { value: 'Source Code Pro, Consolas, Monaco, monospace', label: 'Source Code Pro' },
  { value: 'Inconsolata, Consolas, Monaco, monospace', label: 'Inconsolata' },
  { value: 'Ubuntu Mono, Consolas, Monaco, monospace', label: 'Ubuntu Mono' },
  { value: 'SF Mono, Monaco, Consolas, monospace', label: 'SF Mono' },
  { value: 'Consolas, Monaco, monospace', label: 'Consolas' },
  { value: 'Monaco, Consolas, monospace', label: 'Monaco' },
  { value: 'Courier New, Courier, monospace', label: 'Courier New' },
];

const resolveFontFamily = (fontFamily: string) => {
  if (!fontFamily) return fontFamily;
  return fontFamily
    .split(',')
    .map((font) => {
      const trimmed = font.trim().replace(/['"]/g, '');
      switch (trimmed) {
        case 'Geist Mono':
          return 'var(--font-geist-mono)';
        case 'JetBrains Mono':
          return 'var(--font-jetbrains-mono)';
        case 'Fira Code':
          return 'var(--font-fira-code)';
        case 'Roboto Mono':
          return 'var(--font-roboto-mono)';
        case 'Source Code Pro':
          return 'var(--font-source-code-pro)';
        case 'Inconsolata':
          return 'var(--font-inconsolata)';
        case 'Ubuntu Mono':
          return 'var(--font-ubuntu-mono)';
        default:
          return font;
      }
    })
    .join(', ');
};

export default function FontSettings() {
  const dispatch = useAppDispatch();
  const config = useAppSelector((state) => state.config.ideConfig);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const updateSetting = <K extends keyof IDEConfig>(key: K, value: unknown) => {
    dispatch(setIdeConfig({ [key]: value as IDEConfig[K] }));
  };

  return (
    <div className="flex flex-col gap-6 p-2 animate-in fade-in duration-200">
      {/* Title & Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border pb-3">
        <h2 className="text-lg font-bold text-foreground">Text Editor: Font</h2>
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
            sectionName="Font & Layout Settings"
            onConfirm={() =>
              dispatch(
                setIdeConfig({
                  fontFamily: 'Geist Mono, Consolas, Monaco, monospace',
                  fontSize: 16,
                  fontWeight: 'normal',
                  lineHeight: 1.5,
                  letterSpacing: 0,
                })
              )
            }
          />
        </div>
      </div>

      {/* Font Live Preview Panel at the Top */}
      {isPreviewOpen && mounted && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground">Font Live Preview</h3>
          </div>
          <div className="bg-card-bg border border-card-border p-5 rounded-xl select-none overflow-x-auto min-h-[140px] flex items-center justify-start">
            <pre
              className="w-full"
              style={{
                fontFamily: resolveFontFamily(config.fontFamily),
                fontSize: `${config.fontSize}px`,
                fontWeight: config.fontWeight,
                lineHeight: config.lineHeight,
                letterSpacing: `${config.letterSpacing}px`,
              }}
            >
              <code
                className="text-foreground"
                style={{
                  fontFamily: 'inherit',
                  letterSpacing: 'inherit',
                  fontWeight: 'inherit',
                }}
              >
                {`const monkey = {
  speed: "fast",
  accuracy: 100,
  isHappy: true
};`}
              </code>
            </pre>
          </div>
        </div>
      )}

      {/* Settings Form List */}
      <div className="flex flex-col gap-8 mt-2">
        {/* Font Family */}
        <div className="flex flex-col gap-2 max-w-xl">
          <label className="text-sm font-semibold text-foreground/90">Editor: Font Family</label>
          <p className="text-xs text-untyped">Defines the font faces utilized in the text editor pane.</p>
          <Select
            value={config.fontFamily}
            onChange={(val) => updateSetting('fontFamily', val)}
            options={fontOptions}
            className="w-72"
          />
        </div>

        {/* Font Size */}
        <div className="flex flex-col gap-2 max-w-xl">
          <label className="text-sm font-semibold text-foreground/90">Editor: Font Size</label>
          <p className="text-xs text-untyped">Sets the font size in pixels.</p>
          <Input
            type="number"
            min="12"
            max="28"
            value={config.fontSize}
            onChange={(e) => updateSetting('fontSize', parseInt(e.target.value) || 16)}
            className="w-44"
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
          <Input
            type="number"
            step="0.1"
            min="1"
            max="3"
            value={config.lineHeight}
            onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value) || 1.5)}
            className="w-44"
          />
        </div>

        {/* Letter Spacing */}
        <div className="flex flex-col gap-2 max-w-xl">
          <label className="text-sm font-semibold text-foreground/90">Editor: Letter Spacing</label>
          <p className="text-xs text-untyped">Determines the horizontal tracking or letter spacing in pixels.</p>
          <Input
            type="number"
            step="0.5"
            min="-2"
            max="5"
            value={config.letterSpacing}
            onChange={(e) => updateSetting('letterSpacing', parseFloat(e.target.value) || 0)}
            className="w-44"
          />
        </div>
      </div>
    </div>
  );
}
